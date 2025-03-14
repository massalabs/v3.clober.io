import {
  CHAIN_IDS,
  CHART_LOG_INTERVALS,
  getContractAddresses,
  getPool,
  getPoolPerformance,
  Market,
  Pool as SdkPool,
  PoolPerformanceData,
} from '@clober/v2-sdk'
import { isAddressEqual } from 'viem'

import { START_LP_INFO, VAULT_KEY_INFOS } from '../constants/vault'
import { Prices } from '../model/prices'
import { Vault } from '../model/vault'
import { calculateApy } from '../utils/apy'
import { StackedLineData } from '../components/chart/tvl-chart-model'
import { RPC_URL } from '../constants/rpc-urls'

export async function fetchVaults(
  chainId: CHAIN_IDS,
  prices: Prices,
  market: Market | undefined,
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
    VAULT_KEY_INFOS[chainId].map(async ({ token0, token1, salt }) => {
      const vault = await getPool({
        chainId,
        token0,
        token1,
        salt,
        options: {
          useSubgraph: Object.keys(prices).length === 0,
          rpcUrl: RPC_URL[chainId],
          market,
        },
      })
      const vaultPerformanceData = await getPoolPerformance({
        chainId,
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
    const historicalLpPrices = vaultPerformanceData.poolSnapshots
      .map(({ price, liquidityA, liquidityB, totalSupply, timestamp }) => {
        const _price = Number(price)
        const onHoldValuePerLp =
          (START_LP_INFO[chainId]!.quoteAmount +
            START_LP_INFO[chainId]!.baseAmount * _price) /
          START_LP_INFO[chainId]!.lpAmount
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
        address: getContractAddresses({ chainId }).Rebalancer,
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
      apy: calculateApy(1 + totalSpreadProfit / tvl, 60 * 60 * 24),
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
