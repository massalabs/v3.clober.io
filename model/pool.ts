import { Currency } from './currency'

export type Pool = {
  address: `0x${string}`
  lpCurrency: Currency
  currency0: Currency
  currency1: Currency
  apy: number
  tvl: number
  volume24h: number
  reserve0: number
  reserve1: number
  lpUsdValue: number
  totalSupply: number
  createdAtTimestamp: number
}
