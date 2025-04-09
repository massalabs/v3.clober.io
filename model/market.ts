import { Currency } from './currency'

export type Market = {
  baseCurrency: Currency
  quoteCurrency: Currency
  createAt: number
  bidSideUpdatedAt: number
  askSideUpdatedAt: number
  price: number
  dailyVolume: number
  dailyChange: number
  fdv: number
  liquidityUsd: number
  verified: boolean
}
