import { getAddress } from 'viem'

import { Subgraph } from '../../constants/subgraph'
import { UserPosition } from '../../model/future/user-position'
import { Prices } from '../../model/prices'
import { calculateLiquidationPrice, calculateLtv } from '../../utils/ltv'
import { formatUnits } from '../../utils/bigint'

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
  }
  collateralAmount: string
  debtAmount: string
  averagePrice: string
}

const DEFAULT_COLLATERAL = {
  address: getAddress('0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795'),
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  priceFeedId:
    '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a' as `0x${string}`,
}

export const fetchFuturePosition = async (
  userAddress: `0x${string}`,
  price: Prices,
): Promise<UserPosition[]> => {
  const {
    data: { shortPositions },
  } = await Subgraph.get<{
    data: {
      shortPositions: ShortPositionDto[]
    }
  }>(
    'https://api.goldsky.com/api/public/project_clsljw95chutg01w45cio46j0/subgraphs/clober-future-subgraph-monad-testnet/v1.0.0/gn',
    'getPositions',
    'query getPositions($userAddress: String!) { shortPositions (where: {user: $userAddress }) { id user asset { id assetId currency { id name symbol decimals } collateral { id name symbol decimals } expiration maxLTV liquidationThreshold minDebt } collateralAmount debtAmount averagePrice } }',
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
      return {
        user: getAddress(position.user),
        asset: {
          id: getAddress(position.asset.id),
          currency: debtCurrency,
          collateral: DEFAULT_COLLATERAL,
          expiration: Number(position.asset.expiration),
          maxLTV: BigInt(position.asset.maxLTV),
          liquidationThreshold: BigInt(position.asset.liquidationThreshold),
          ltvPrecision: 1000000n,
          minDebt: BigInt(position.asset.minDebt),
        },
        type: 'short' as const,
        collateralAmount: BigInt(position.collateralAmount),
        debtAmount: BigInt(position.debtAmount),
        liquidationPrice: calculateLiquidationPrice(
          debtCurrency,
          price[debtCurrency.address],
          DEFAULT_COLLATERAL,
          price[DEFAULT_COLLATERAL.address],
          BigInt(position.debtAmount),
          BigInt(position.collateralAmount),
          BigInt(position.asset.liquidationThreshold),
          1000000n,
        ),
        ltv: calculateLtv(
          debtCurrency,
          price[debtCurrency.address],
          BigInt(position.debtAmount),
          DEFAULT_COLLATERAL,
          price[DEFAULT_COLLATERAL.address],
          BigInt(position.collateralAmount),
        ),
        averagePrice,
        pnl: 1 - price[debtCurrency.address] / averagePrice,
        profit: debtAmountDB * (averagePrice - price[debtCurrency.address]),
      }
    }),
  ].filter((position) => price[position.asset.currency.address] > 0)
}
