import { defineChain } from 'viem'

import { RPC_URL } from './rpc-urls'

export const monadTestnet = /*#__PURE__*/ defineChain({
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: [RPC_URL[10143]],
    },
    public: {
      http: [RPC_URL[10143]],
    },
  },
  blockExplorers: {
    default: {
      name: 'monadexplorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0x6cEfcd4DCA776FFaBF6E244616ea573e4d646566',
      blockCreated: 42209,
    },
  },
})
