import { Asset } from './asset'

export type UserPosition = {
  // immutable values
  user: `0x${string}`
  asset: Asset
  type: 'long' | 'short'
  // mutable values
  collateralAmount?: bigint
  debtAmount?: bigint
  liquidationPrice?: number
  ltv?: number
  averagePrice: number
  pnl: number
  profit: number
}
