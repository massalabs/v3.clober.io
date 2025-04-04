import { CHAIN_IDS } from '@clober/v2-sdk'

export const RPC_URL: {
  [chain in CHAIN_IDS]: string
} = {
  [CHAIN_IDS.BASE]:
    'https://base-mainnet.g.alchemy.com/v2/3Um4IcT1mrq2MEOYurXvsRAzk_v3Q_4X',
  [CHAIN_IDS.MONAD_TESTNET]:
    'https://monad-testnet.blockvision.org/v1/2uIMqtxI4tKB9wkTX3ozeutNKfp',
}
