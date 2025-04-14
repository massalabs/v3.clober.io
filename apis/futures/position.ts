import { CHAIN_IDS } from '@clober/v2-sdk'
import { monadTestnet } from 'viem/chains'
import { createPublicClient, getAddress, http, isAddressEqual } from 'viem'

import { FuturesPosition } from '../../model/futures/futures-position'
import { Prices } from '../../model/prices'
import { supportChains } from '../../constants/chain'
import { RPC_URL } from '../../constants/rpc-url'
import { WHITE_LISTED_ASSETS } from '../../constants/futures/asset'
import { FUTURES_CONTRACT_ADDRESSES } from '../../constants/futures/contract-addresses'
import { Asset } from '../../model/futures/asset'
import { calculateLiquidationPrice, calculateLtv } from '../../utils/ltv'
import { FUTURES_SUBGRAPH_ENDPOINT } from '../../constants/futures/subgraph-endpoint'
import { Subgraph } from '../../model/subgraph'

type PositionDto = {
  id: string
  user: string
  asset: {
    id: string
    assetId: string
    currency: {
      id: string
      name: string
      symbol: string
      decimals: string
    }
    collateral: {
      id: string
      name: string
      symbol: string
      decimals: string
    }
    expiration: string
    maxLTV: string
    liquidationThreshold: string
    minDebt: string
    settlePrice: string
  }
  collateralAmount: string
  debtAmount: string
  averagePrice: string
}

const _abi = [
  {
    type: 'function',
    name: 'getPosition',
    inputs: [
      {
        name: 'debtToken',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'collateral',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'debt',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
] as const

export const fetchFuturesPositions = async (
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
  prices: Prices,
  assets: Asset[],
): Promise<FuturesPosition[]> => {
  if (
    chainId !== monadTestnet.id ||
    !FUTURES_CONTRACT_ADDRESSES[chainId]?.FuturesMarket
  ) {
    return []
  }
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === chainId),
    transport: http(RPC_URL[chainId]),
  })

  const {
    data: { positions },
  } = await Subgraph.get<{
    data: {
      positions: PositionDto[]
    }
  }>(
    FUTURES_SUBGRAPH_ENDPOINT[chainId]!,
    'getPositions',
    'query getPositions($userAddress: String!) { positions (where: {user: $userAddress }) { id user asset { id assetId currency { id name symbol decimals } collateral { id name symbol decimals } expiration maxLTV settlePrice liquidationThreshold minDebt } collateralAmount debtAmount averagePrice } }',
    {
      userAddress: userAddress.toLowerCase(),
    },
  )

  const results = await publicClient.multicall({
    contracts: WHITE_LISTED_ASSETS.map((asset) => ({
      address: FUTURES_CONTRACT_ADDRESSES[chainId]!.FuturesMarket,
      abi: _abi,
      functionName: 'getPosition',
      args: [asset, userAddress],
    })),
  })
  return results
    .map((result, index) => {
      const asset = assets.find((asset) =>
        isAddressEqual(asset.currency.address, WHITE_LISTED_ASSETS[index]),
      )
      if (result.error || !asset) {
        return null
      }
      const offChainPosition = positions.find(
        (position) =>
          `${userAddress.toLowerCase()}-${asset.id.toLowerCase()}` ===
          position.id,
      )
      if (!offChainPosition) {
        return null
      }
      const collateralAmount = BigInt(result.result[0])
      const debtAmount = BigInt(result.result[1])
      return {
        user: getAddress(userAddress),
        asset,
        collateralAmount,
        debtAmount,
        liquidationPrice: calculateLiquidationPrice(
          asset.currency,
          prices[asset.currency.address],
          asset.collateral,
          prices[asset.collateral.address],
          BigInt(debtAmount),
          BigInt(collateralAmount),
          BigInt(asset.liquidationThreshold),
          1000000n,
        ),
        ltv: calculateLtv(
          asset.currency,
          prices[asset.currency.address],
          debtAmount,
          asset.collateral,
          prices[asset.collateral.address],
          collateralAmount,
        ),
        averagePrice: Number(offChainPosition.averagePrice),
      } as FuturesPosition
    })
    .filter(
      (position) =>
        position &&
        position.debtAmount > 0n &&
        prices[position.asset.currency.address] > 0,
    ) as FuturesPosition[]
}
