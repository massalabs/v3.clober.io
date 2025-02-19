import { CHAIN_IDS } from '@clober/v2-sdk'

export const GAS_PRICES: {
  [chain in number]: bigint
} = { [CHAIN_IDS.BASE]: 0n }
