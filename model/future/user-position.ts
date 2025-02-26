import { Asset } from './asset'

export type UserPosition = {
  user: `0x${string}`
  asset: Asset & { totalSupply: bigint }
  collateralAmount: bigint
  debtAmount: bigint
  liquidationPrice: number
  ltv: number
  type: 'long' | 'short'
}
