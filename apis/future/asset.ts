import { getAddress } from 'viem'

import { Asset } from '../../model/future/asset'
import { Subgraph } from '../../constants/subgraph'
import { COLLATERALS } from '../../constants/future/collateral'
import { ASSET_ICONS } from '../../constants/future/asset'

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

export const fetchFutureAssets = async (chainId: number): Promise<Asset[]> => {
  const {
    data: { assets },
  } = await Subgraph.get<{
    data: {
      assets: AssetDto[]
    }
  }>(
    'https://api.goldsky.com/api/public/project_clsljw95chutg01w45cio46j0/subgraphs/clober-future-subgraph-monad-testnet/v1.0.0/gn',
    'getAssets',
    'query getAssets { assets { id assetId currency { id name symbol decimals } collateral { id name symbol decimals } expiration maxLTV liquidationThreshold minDebt settlePrice } }',
    {},
  )
  return assets
    .map((asset) => {
      const collateral = COLLATERALS[chainId].find(
        (collateral) => collateral.address === getAddress(asset.collateral.id),
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
        settlePrice: BigInt(asset.settlePrice),
      }
    })
    .filter((asset) => asset !== undefined) as Asset[]
}
