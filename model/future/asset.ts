import { Currency } from '../currency'

export type Asset = {
  id: `0x${string}`
  currency: Currency
  priceFeedId: `0x${string}` // https://www.pyth.network/developers/price-feed-ids#pyth-evm-stable
  collateral: Currency
  expiration: number // expiry timestamp
  maxLTV: bigint // max loanable value in ux
  liquidationThreshold: bigint
  ltvPrecision: bigint
  minDebt: bigint
}
