import { CHAIN_IDS } from '@clober/v2-sdk'
import { zeroHash } from 'viem'

export const START_LP_INFO: {
  [chain in CHAIN_IDS]: {
    quoteAmount: number
    baseAmount: number
    lpAmount: number
  } | null
} = {
  [CHAIN_IDS.BASE]: {
    quoteAmount: 271.254,
    baseAmount: 0.1,
    lpAmount: 271.254,
  },
  [CHAIN_IDS.MONAD_TESTNET]: {
    quoteAmount: 1,
    baseAmount: 1,
    lpAmount: 1,
  },
}

export const VAULT_KEY_INFOS: {
  [chain in CHAIN_IDS]: {
    token0: `0x${string}`
    token1: `0x${string}`
    salt: `0x${string}`
    key: `0x${string}`
  }[]
} = {
  [CHAIN_IDS.BASE]: [
    {
      token0: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      token1: '0x4200000000000000000000000000000000000006',
      salt: zeroHash,
      key: '0xc8cbe608c82ee9c4c30f01d7c0eefd977538ac396ed34430aa3993bfe0d363ae',
    },
  ],
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      token0: '0x0000000000000000000000000000000000000000',
      token1: '0x836047a99e11F376522B447bffb6e3495Dd0637c',
      salt: zeroHash,
      key: '0x1a88c42e7b975cce3065267bc13573954569a9775f6939b1447a25b9d4505f69',
    },
  ],
}
