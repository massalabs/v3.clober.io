import { getAddress, isAddressEqual } from 'viem'
import { CHAIN_IDS } from '@clober/v2-sdk'
import { monadTestnet } from 'viem/chains'

import { Subgraph } from '../../model/subgraph'
import { UserPosition } from '../../model/futures/user-position'
import { Prices } from '../../model/prices'
import { calculateLiquidationPrice, calculateLtv } from '../../utils/ltv'
import { formatUnits } from '../../utils/bigint'
import { FUTURES_COLLATERALS } from '../../constants/futures/collaterals'
import { ASSET_ICONS, WHITE_LISTED_ASSETS } from '../../constants/futures/asset'
import { FUTURES_SUBGRAPH_ENDPOINT } from '../../constants/futures/subgraph-endpoint'

type ShortPositionDto = {
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

export const fetchFuturesPositions = async (
  chainId: CHAIN_IDS,
  userAddress: `0x${string}`,
  prices: Prices,
): Promise<UserPosition[]> => {
  if (chainId !== monadTestnet.id) {
    return []
  }
  const {
    data: { shortPositions },
  } = await Subgraph.get<{
    data: {
      shortPositions: ShortPositionDto[]
    }
  }>(
    FUTURES_SUBGRAPH_ENDPOINT[chainId]!,
    'getPositions',
    'query getPositions($userAddress: String!) { shortPositions (where: {user: $userAddress }) { id user asset { id assetId currency { id name symbol decimals } collateral { id name symbol decimals } expiration maxLTV settlePrice liquidationThreshold minDebt } collateralAmount debtAmount averagePrice } }',
    {
      userAddress: userAddress.toLowerCase(),
    },
  )

  return [
    ...shortPositions.map((position) => {
      const debtCurrency = {
        address: getAddress(position.asset.currency.id),
        name: position.asset.currency.name,
        symbol: position.asset.currency.symbol,
        decimals: Number(position.asset.currency.decimals),
        priceFeedId: position.asset.assetId as `0x${string}`,
      }
      const averagePrice = Number(position.averagePrice)
      const debtAmountDB = Number(
        formatUnits(BigInt(position.debtAmount), debtCurrency.decimals),
      )
      const collateral = FUTURES_COLLATERALS.find((collateral) =>
        isAddressEqual(
          collateral.address,
          position.asset.collateral.id as `0x${string}`,
        ),
      )
      if (!collateral) {
        return undefined
      }
      return {
        user: getAddress(position.user),
        asset: {
          id: getAddress(position.asset.id),
          currency: {
            ...debtCurrency,
            icon: ASSET_ICONS[position.asset.assetId],
          },
          collateral,
          expiration: Number(position.asset.expiration),
          maxLTV: BigInt(position.asset.maxLTV),
          liquidationThreshold: BigInt(position.asset.liquidationThreshold),
          ltvPrecision: 1000000n,
          minDebt: BigInt(position.asset.minDebt),
          settlePrice: Number(position.asset.settlePrice),
        },
        type: 'short' as const,
        collateralAmount: BigInt(position.collateralAmount),
        debtAmount: BigInt(position.debtAmount),
        liquidationPrice: calculateLiquidationPrice(
          debtCurrency,
          prices[debtCurrency.address],
          collateral,
          prices[collateral.address],
          BigInt(position.debtAmount),
          BigInt(position.collateralAmount),
          BigInt(position.asset.liquidationThreshold),
          1000000n,
        ),
        ltv: calculateLtv(
          debtCurrency,
          prices[debtCurrency.address],
          BigInt(position.debtAmount),
          collateral,
          prices[collateral.address],
          BigInt(position.collateralAmount),
        ),
        averagePrice,
        pnl: averagePrice / prices[debtCurrency.address],
        profit: debtAmountDB * (averagePrice - prices[debtCurrency.address]),
      }
    }),
  ].filter(
    (position) =>
      position &&
      prices[position.asset.currency.address] > 0 &&
      WHITE_LISTED_ASSETS.includes(position.asset.currency.address),
  ) as UserPosition[]
}
