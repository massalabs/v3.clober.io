import { CHAIN_IDS } from '@clober/v2-sdk'
import { getAddress } from 'viem'

export const FUTURES_CONTRACT_ADDRESSES: {
  [chain in CHAIN_IDS]:
    | {
        VaultManager: `0x${string}`
        Pyth: `0x${string}`
      }
    | undefined
} = {
  [CHAIN_IDS.BASE]: undefined,
  [CHAIN_IDS.MONAD_TESTNET]: {
    VaultManager: getAddress('0xAa7a07414d23F1153ED13C702CB84c5DD1319a62'),
    Pyth: getAddress('0x2880aB155794e7179c9eE2e38200202908C17B43'),
  },
}
