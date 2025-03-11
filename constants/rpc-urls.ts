import { CHAIN_IDS } from '@clober/v2-sdk'

export const RPC_URL: {
  [chain in number]: string
} = {
  [CHAIN_IDS.BASE]: 'https://mainnet.base.org',
  [CHAIN_IDS.MONAD_TESTNET]:
    'https://side-cold-water.monad-testnet.quiknode.pro/cdca51dfe940664aca31fad3acaee682eee43c3b/',
}
