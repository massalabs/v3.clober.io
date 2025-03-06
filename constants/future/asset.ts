import { CHAIN_IDS } from '@clober/v2-sdk'

import { Asset } from '../../model/future/asset'

export const ASSETS: {
  [chain in number]: Asset[]
} = {
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      id: '0x8b4E47C9fEEc01c83B84eb8b8f6B3c68ca743c48',
      currency: {
        address: '0x8b4E47C9fEEc01c83B84eb8b8f6B3c68ca743c48',
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
      expiration: 1743508800,
      maxLTV: 500000n,
      liquidationThreshold: 750000n,
      ltvPrecision: 1000000n,
      minDebt: 1000000000000000000n,
    },
    {
      id: '0x7Aff20Af80321c12211583E60f40C068398a53C7',
      currency: {
        address: '0x7Aff20Af80321c12211583E60f40C068398a53C7',
        decimals: 18,
        name: 'BTC',
        symbol: 'BTC',
        icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fcrypto-btc-usd.inline.svg&w=3840&q=75',
        priceFeedId:
          '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
      },
      collateral: {
        address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        priceFeedId:
          '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
      },
      expiration: 1741263077,
      maxLTV: 500000n,
      liquidationThreshold: 750000n,
      ltvPrecision: 1000000n,
      minDebt: 1000000000000000n,
    },
  ],
}

export const TRADING_VIEW_SYMBOLS: {
  [assetId in string]: string
} = {
  '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43':
    'BINANCE:BTCUSDT',
  '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688':
    'NASDAQ:AAPL',
}
