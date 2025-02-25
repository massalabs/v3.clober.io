import { Asset } from './asset'

export type UserPosition = {
  user: `0x${string}`
  asset: Asset
  collateralAmount: bigint
  debtAmount: bigint
}
