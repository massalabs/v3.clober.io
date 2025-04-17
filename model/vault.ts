import { StackedLineData } from '../components/chart/tvl-chart-model'

import { Currency } from './currency'

export type VaultImmutableInfo = {
  currencyA: Currency
  currencyB: Currency
  salt: `0x${string}`
  key: `0x${string}`
  hasDashboard: boolean
  hasPoint: boolean
  initialLPInfo?: {
    quoteTokenAmount: number
    baseTokenAmount: number
    lpTokenAmount: number
    timestamp: number
    initialPriceMultiplier: number
  }
}

export type Vault = {
  key: `0x${string}`
  lpCurrency: Currency
  lpUsdValue: number
  currency0: Currency
  currency1: Currency
  apy: number
  tvl: number
  volume24h: number
  reserve0: number
  reserve1: number
  totalSupply: number
  historicalPriceIndex: StackedLineData[]
}

export type VaultPosition = {
  vault: Vault
  amount: bigint
  value: number
}
