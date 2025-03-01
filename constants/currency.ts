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
  [CHAIN_IDS.MONAD_TESTNET]: {
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
    name: 'Wrapped Monad Token',
    symbol: 'WMON',
    decimals: 18,
  },
}

export const ETH: Currency = {
  address: zeroAddress,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
}

const MON: Currency = {
  address: zeroAddress,
  name: 'Monad Token',
  symbol: 'MON',
  decimals: 18,
  icon: '/monad.svg',
}

export const WHITELISTED_CURRENCIES: {
  [chain in number]: Currency[]
} = {
  [CHAIN_IDS.BASE]: [],
  [CHAIN_IDS.MONAD_TESTNET]: [
    MON,
    {
      address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
      name: 'Wrapped Monad Token',
      symbol: 'WMON',
      decimals: 18,
    },
    {
      address: '0xe679FEDA8b57d7Ba66C240d13f1Fc26A38B4E01A',
      name: 'BTC',
      symbol: 'BTC',
      decimals: 18,
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fcrypto-btc-usd.inline.svg&w=3840&q=75',
    },
  ],
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
  [CHAIN_IDS.MONAD_TESTNET]: {
    address: zeroAddress,
    name: 'Monad Token',
    symbol: 'MON',
    decimals: 18,
    icon: '/monad.svg',
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
  [CHAIN_IDS.MONAD_TESTNET]: {
    address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
}
