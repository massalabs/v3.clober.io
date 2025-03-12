import { CHAIN_IDS } from '@clober/v2-sdk'

export const RPC_URL: {
  [chain in number]: string
} = {
  [CHAIN_IDS.BASE]: 'https://mainnet.base.org',
  [CHAIN_IDS.MONAD_TESTNET]:
    'https://monad-testnet.g.alchemy.com/v2/rBna9uEs-PtanJJw4HM-g_Xg0qb5kOgL',
}
