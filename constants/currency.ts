import { zeroAddress } from 'viem'
import { CHAIN_IDS } from '@clober/v2-sdk'

import { Currency } from '../model/currency'

export const WETH: {
  [chain in number]: Currency
} = {
  [CHAIN_IDS.BASE]: {
    address: '0x4200000000000000000000000000000000000006',
    name: 'Wrapped ETH',
    symbol: 'WETH',
    decimals: 18,
  },
}

export const ETH: Currency = {
  address: zeroAddress,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
}

export const WHITELISTED_CURRENCIES: {
  [chain in number]: Currency[]
} = {
  [CHAIN_IDS.BASE]: [],
}

export const DEFAULT_INPUT_CURRENCY: {
  [chain in number]: Currency
} = {
  [CHAIN_IDS.BASE]: {
    address: '0x4200000000000000000000000000000000000006',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
}

export const DEFAULT_OUTPUT_CURRENCY: {
  [chain in number]: Currency
} = {
  [CHAIN_IDS.BASE]: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
}
