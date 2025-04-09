import { Currency } from './currency'

export type Market = {
  baseCurrency: Currency
  quoteCurrency: Currency
  createAt: number
  updatedAt: number
  price: number
  dailyVolume: number
  dailyChange: number
  fdv: number
  verified: boolean
}
