import {
  CHART_LOG_INTERVALS,
  getContractAddresses,
  getPool,
  getPoolPerformance,
  Pool as SdkPool,
  PoolPerformanceData,
} from '@clober/v2-sdk'
import { isAddressEqual } from 'viem'

import { WHITELISTED_VAULTS } from '../constants/vault'
import { Prices } from '../model/prices'
import { Vault } from '../model/vault'
import { calculateApy } from '../utils/apy'
import { StackedLineData } from '../components/chart/tvl-chart-model'
import { RPC_URL } from '../constants/rpc-url'
import { Chain } from '../model/chain'

export async function fetchVaults(
  chain: Chain,
  prices: Prices,
): Promise<Vault[]> {
  const currentTimestampInSeconds = Math.floor(new Date().getTime() / 1000)
  const _5minNormalizedCurrentTimestampInSeconds =
    currentTimestampInSeconds - (currentTimestampInSeconds % (60 * 5))
  const _1hourNormalizedCurrentTimestampInSeconds =
    currentTimestampInSeconds - (currentTimestampInSeconds % (60 * 60))

  const vaults: {
    vault: SdkPool
    vaultPerformanceData: PoolPerformanceData
  }[] = await Promise.all(
    WHITELISTED_VAULTS[chain.id].map(async ({ token0, token1, salt }) => {
      const vault = await getPool({
        chainId: chain.id,
        token0,
        token1,
        salt,
        options: {
          useSubgraph: true,
          rpcUrl: RPC_URL[chain.id],
        },
      })
      const vaultPerformanceData = await getPoolPerformance({
        chainId: chain.id,
        token0,
        token1,
        salt,
        // volume
        volumeFromTimestamp:
          _5minNormalizedCurrentTimestampInSeconds - 60 * 60 * 24,
        volumeToTimestamp: _5minNormalizedCurrentTimestampInSeconds,
        // performance chart
        snapshotFromTimestamp:
          _1hourNormalizedCurrentTimestampInSeconds - 60 * 60 * 24 * 90,
        snapshotToTimestamp: _1hourNormalizedCurrentTimestampInSeconds,
        snapshotIntervalType: CHART_LOG_INTERVALS.oneHour,
        // apy
        spreadProfitFromTimestamp:
          _5minNormalizedCurrentTimestampInSeconds - 60 * 60 * 24,
        spreadProfitToTimestamp: _5minNormalizedCurrentTimestampInSeconds,
        options: {
          pool: vault,
          useSubgraph: true,
        },
      })
      return { vault, vaultPerformanceData }
    }),
  )
  return vaults.map(({ vault, vaultPerformanceData }) => {
    const base = vault.market.base
    const quote = vault.market.quote
    const spreadProfits = vaultPerformanceData.poolSpreadProfits.sort(
      (a, b) => a.timestamp - b.timestamp,
    )
    const startLPInfo = WHITELISTED_VAULTS[chain.id].find(
      ({ key }) => key.toLowerCase() === vault.key.toLowerCase(),
    )?.startLPInfo
    if (!startLPInfo) {
      throw new Error('startLPInfo not found')
    }
    const historicalLpPrices = vaultPerformanceData.poolSnapshots
      .map(({ price, liquidityA, liquidityB, totalSupply, timestamp }) => {
        const _price = Number(price) * startLPInfo.priceMultiplier
        const onHoldValuePerLp =
          (startLPInfo.quoteAmount + startLPInfo.baseAmount * _price) /
          startLPInfo.lpAmount
        const usdValue = isAddressEqual(
          base.address,
          liquidityA.currency.address,
        )
          ? Number(liquidityA.value) * _price + Number(liquidityB.value)
          : Number(liquidityB.value) * _price + Number(liquidityA.value)
        const lpPrice =
          Number(totalSupply.value) === 0
            ? 0
            : usdValue / Number(totalSupply.value)
        return {
          lpPrice,
          time: Number(timestamp),
          pnl: lpPrice / onHoldValuePerLp,
        }
      })
      .sort((a, b) => a.time - b.time)
    const firstNonZeroIndex = historicalLpPrices.findIndex(
      ({ lpPrice }) => lpPrice > 0,
    )
    const startLpPrice =
      firstNonZeroIndex === -1
        ? 1
        : historicalLpPrices[firstNonZeroIndex].lpPrice
    const historicalPriceIndex = historicalLpPrices.map(
      ({ pnl, lpPrice, time }) => {
        return {
          values: [lpPrice !== 0 ? lpPrice / startLpPrice : 0, pnl, 0],
          time,
        }
      },
    )
    const tvl =
      (prices[vault.currencyA.address] ?? 0) *
        Number(vault.liquidityA.total.value) +
      (prices[vault.currencyB.address] ?? 0) *
        Number(vault.liquidityB.total.value)
    const totalSpreadProfit = spreadProfits.reduce(
      (acc, { accumulatedProfitInUsd }) => acc + Number(accumulatedProfitInUsd),
      0,
    )
    return {
      key: vault.key,
      lpCurrency: {
        address: getContractAddresses({ chainId: chain.id }).Rebalancer,
        name: `Clober LP ${vault.currencyA.symbol}/${vault.currencyB.symbol}`,
        symbol: `${vault.currencyA.symbol}/${vault.currencyB.symbol}`,
        decimals: 18,
      },
      lpUsdValue: tvl / Number(vault.totalSupply.value),
      currency0: vault.currencyA,
      currency1: vault.currencyB,
      reserve0: Number(vault.liquidityA.total.value),
      reserve1: Number(vault.liquidityB.total.value),
      tvl,
      apy: chain.testnet
        ? calculateApy(1 + totalSpreadProfit / tvl, 24 * 60 * 60)
        : calculateApy(
            historicalLpPrices.sort((a, b) => b.time - a.time)[0].pnl,
            currentTimestampInSeconds - startLPInfo.timestamp,
          ),
      volume24h: vaultPerformanceData.poolVolumes.reduce(
        (acc, { currencyAVolume, currencyBVolume }) =>
          acc +
          (isAddressEqual(currencyAVolume.currency.address, quote.address)
            ? Number(currencyAVolume.value)
            : Number(currencyBVolume.value)),
        0,
      ),
      historicalPriceIndex: historicalPriceIndex.slice(
        firstNonZeroIndex,
      ) as StackedLineData[],
    }
  })
}
