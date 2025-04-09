import { Currency } from './currency'

export type Market = {
  baseCurrency: Currency
  quoteCurrency: Currency
  createAt: number
  bidSideUpdatedAt: number
  isBidTaken: boolean
  askSideUpdatedAt: number
  isAskTaken: boolean
  price: number
  dailyVolume: number
  dailyChange: number
  fdv: number
  liquidityUsd: number
  verified: boolean
}
