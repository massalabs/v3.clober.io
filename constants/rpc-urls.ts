import { CHAIN_IDS } from '@clober/v2-sdk'

export const RPC_URL: {
  [chain in number]: string
} = {
  [CHAIN_IDS.BASE]:
    'https://base-mainnet.g.alchemy.com/v2/3Um4IcT1mrq2MEOYurXvsRAzk_v3Q_4X',
  [CHAIN_IDS.MONAD_TESTNET]:
    'https://side-cold-water.monad-testnet.quiknode.pro/cdca51dfe940664aca31fad3acaee682eee43c3b/',
}
