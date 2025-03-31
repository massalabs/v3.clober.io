import { getAddress, isAddressEqual } from 'viem'
import { CHAIN_IDS } from '@clober/v2-sdk'
import { monadTestnet } from 'viem/chains'

import { Asset } from '../../model/future/asset'
import { Subgraph } from '../../constants/subgraph'
import { COLLATERALS } from '../../constants/future/collateral'
import { ASSET_ICONS } from '../../constants/future/asset'
import { FUTURES_SUBGRAPH_ENDPOINTS } from '../../constants/future/subgraph-endpoint'

type AssetDto = {
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

export const fetchFutureAssets = async (
  chainId: CHAIN_IDS,
): Promise<Asset[]> => {
  if (chainId !== monadTestnet.id) {
    return []
  }
  const {
    data: { assets },
  } = await Subgraph.get<{
    data: {
      assets: AssetDto[]
    }
  }>(
    FUTURES_SUBGRAPH_ENDPOINTS[chainId]!,
    'getAssets',
    'query getAssets { assets { id assetId currency { id name symbol decimals } collateral { id name symbol decimals } expiration maxLTV liquidationThreshold minDebt settlePrice } }',
    {},
  )
  return assets
    .map((asset) => {
      const collateral = COLLATERALS[chainId].find((collateral) =>
        isAddressEqual(collateral.address, getAddress(asset.collateral.id)),
      )
      if (!collateral) {
        return undefined
      }
      return {
        id: getAddress(asset.id),
        currency: {
          address: getAddress(asset.currency.id),
          name: asset.currency.name,
          symbol: asset.currency.symbol,
          decimals: Number(asset.currency.decimals),
          priceFeedId: asset.assetId as `0x${string}`,
          icon: ASSET_ICONS[asset.assetId],
        },
        collateral,
        expiration: Number(asset.expiration),
        maxLTV: BigInt(asset.maxLTV),
        liquidationThreshold: BigInt(asset.liquidationThreshold),
        ltvPrecision: 1000000n,
        minDebt: BigInt(asset.minDebt),
        settlePrice: Number(asset.settlePrice),
      }
    })
    .filter((asset) => asset !== undefined) as Asset[]
}
