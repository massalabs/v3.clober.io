import { Currency } from './currency'

type Trade = {
  currency: Currency
  pnl: number
  amount: number
}

export type TradingCompetitionPnl = {
  totalPnl: number
  trades: Trade[]
}
