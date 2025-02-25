import { CHAIN_IDS } from '@clober/v2-sdk'

import { Asset } from '../../model/future/asset'

export const ASSETS: {
  [chain in number]: Asset[]
} = {
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      id: '0x',
      currency: {
        address: '0x0000000000000000000000000000000000000001', // Todo: change to real address
        decimals: 18,
        name: 'AAPL',
        symbol: 'AAPL',
        icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-aapl-usd.inline.svg&w=1920&q=75',
        priceFeedId:
          '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688',
      },
      collateral: {
        address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        priceFeedId:
          '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      },
      expiration: 1635724800, // todo: change to real expiration
      maxLTV: 700000n,
      liquidationThreshold: 800000n,
      ltvPrecision: 1000000n,
      minDebt: 10n * 10n ** 6n,
    },
  ],
}
