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

const MOD: Currency = {
  address: zeroAddress,
  name: 'Monad Token',
  symbol: 'MOD',
  decimals: 18,
  icon: '/monad.svg',
}

export const WHITELISTED_CURRENCIES: {
  [chain in number]: Currency[]
} = {
  [CHAIN_IDS.BASE]: [],
  [CHAIN_IDS.MONAD_TESTNET]: [
    MOD,
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
    symbol: 'MOD',
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
