import { createPublicClient, http, isAddressEqual, zeroAddress } from 'viem'
import {
  CHAIN_IDS,
  CHART_LOG_INTERVALS,
  getChartLogs,
  Market,
} from '@clober/v2-sdk'
import { getCurrentTimestamp } from 'hardhat/internal/hardhat-network/provider/utils/getCurrentTimestamp'

import { supportChains } from '../constants/chain'
import { RPC_URL } from '../constants/rpc-urls'
import { ERC20_PERMIT_ABI } from '../abis/@openzeppelin/erc20-permit-abi'
import { DEFAULT_TOKEN_INFO, TokenInfo } from '../model/token-info'
import { formatUnits } from '../utils/bigint'

export async function fetchTotalSupply(
  chainId: CHAIN_IDS,
  tokenAddress: `0x${string}`,
): Promise<bigint> {
  if (isAddressEqual(tokenAddress, zeroAddress)) {
    return 120_000_000n * 10n ** 18n // DEV: 120M for ETH
  }
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === chainId),
    transport: http(RPC_URL[chainId]),
  })
  return publicClient.readContract({
    address: tokenAddress,
    abi: ERC20_PERMIT_ABI,
    functionName: 'totalSupply',
  })
}

export async function fetchTokenInfoFromOrderBook(
  chainId: CHAIN_IDS,
  selectedMarket: Market,
  quoteValue: number,
): Promise<TokenInfo> {
  const currentTimestampInSeconds = getCurrentTimestamp()
  const [totalSupply, chartLog] = await Promise.all([
    fetchTotalSupply(chainId, selectedMarket.base.address),
    getChartLogs({
      chainId: chainId,
      quote: selectedMarket.quote.address,
      base: selectedMarket.base.address,
      intervalType: CHART_LOG_INTERVALS.oneDay,
      from:
        currentTimestampInSeconds -
        (currentTimestampInSeconds % (24 * 60 * 60)),
      to: currentTimestampInSeconds,
    }),
  ])
  const price = Number(chartLog?.[0]?.close ?? 0)
  const volume = Number(chartLog?.[0]?.volume ?? 0)
  return {
    ...DEFAULT_TOKEN_INFO,
    volume: {
      ...DEFAULT_TOKEN_INFO.volume,
      h24: volume * price * quoteValue,
    },
    liquidity: {
      ...DEFAULT_TOKEN_INFO.liquidity,
      usd:
        selectedMarket.bids.reduce(
          (acc, { price, baseAmount }) =>
            acc + Number(price) * Number(baseAmount) * quoteValue,
          0,
        ) +
        selectedMarket.asks.reduce(
          (acc, { baseAmount }) => acc + Number(baseAmount),
          0,
        ) *
          price *
          quoteValue,
    },
    priceUsd: price * quoteValue,
    priceNative: price,
    fdv:
      price *
      quoteValue *
      Number(formatUnits(totalSupply, selectedMarket.base.decimals)),
    marketCap:
      price *
      quoteValue *
      Number(formatUnits(totalSupply, selectedMarket.base.decimals)),
  }
}
