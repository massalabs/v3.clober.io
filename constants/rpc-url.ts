import { CHAIN_IDS } from '@clober/v2-sdk'

export const RPC_URL: {
  [chain in CHAIN_IDS]: string
} = {
  [CHAIN_IDS.BASE]:
    'https://base.blockpi.network/v1/rpc/d19f249ccf70c63f55e6fcddf5903edfc7b8df32',
  [CHAIN_IDS.MONAD_TESTNET]:
    'https://monad-testnet.blockvision.org/v1/2uIMqtxI4tKB9wkTX3ozeutNKfp',
}
