import { Asset } from './asset'

export type FuturesPosition = {
  user: `0x${string}`
  asset: Asset
  collateralAmount: bigint
  debtAmount: bigint
  liquidationPrice: number
  ltv: number
  averagePrice: number
}
