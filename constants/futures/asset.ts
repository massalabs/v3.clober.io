import { getAddress } from 'viem'

export const MARKET_HOURS: {
  [assetId in string]: {
    open: number
    close: number
  }
} = {
  '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688': {
    open: 1430,
    close: 2100,
  },
  '0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a': {
    open: 1430,
    close: 2100,
  },
  '0xe65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2': {
    open: 1430,
    close: 2100,
  },
  '0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1': {
    open: 1430,
    close: 2100,
  },
  '0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1': {
    open: 1430,
    close: 2100,
  },
  '0x5967c196ca33171a0b2d140ddc6334b998dd71c2ddd85ba7920c35fd6ed20fe9': {
    open: 1430,
    close: 2100,
  },
}

export const ASSET_ICONS: {
  [assetId in string]: string
} = {
  '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fcrypto-btc-usd.inline.svg&w=3840&q=75',
  '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-aapl-usd.inline.svg&w=1920&q=75',
  '0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-amzn-usd.inline.svg&w=1920&q=75',
  '0xe65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-goog-usd.inline.svg&w=1920&q=75',
  '0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-msft-usd.inline.svg&w=1920&q=75',
  '0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-tsla-usd.inline.svg&w=1920&q=75',
  '0xb44565b8b9b39ab2f4ba792f1c8f8aa8ef7d780e709b191637ef886d96fd1472':
    'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public',
  '0x5967c196ca33171a0b2d140ddc6334b998dd71c2ddd85ba7920c35fd6ed20fe9':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-ivv-usd.inline.svg&w=3840&q=75',
}

export const WHITE_LISTED_ASSETS: `0x${string}`[] = [
  '0x6Ec1C48Eef35617319EDa970E387f155EaeDa79f', // AAPL-USDC, Apr 01 25, 09:00
  '0x5293596273432de9Ec74B63235b0264831bB61Cc', // AMZN-USDC, Apr 01 25, 09:00
  '0xE9E6ceF9043A64b0284AFe5993Da11c1381bBc72', // BTC-USDC, Apr 01 25, 09:00
  '0x2f8fb46539BfCDEBa867Ca892bDB66e4ba46c394', // GOOG-USDC, Apr 01 25, 09:00
  '0x2E4FcD2AB14ea77dfdE67d12489c64af92DB1493', // MSFT-USDC, Apr 01 25, 09:00
  '0x48aE1080948EAa1b7F5EfEb3914b45F0c41F736d', // MONAD-TGE
  '0x6A922cdB0C88Bce79aFe85f65Cc1d10cd3bF6d86', /// IVV
].map((address) => getAddress(address))

export const TRADING_VIEW_SYMBOLS: {
  [assetId in string]: string
} = {
  '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43':
    'BINANCE:BTCUSDT',
  '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688':
    'NASDAQ:AAPL',
  '0xb5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a':
    'NASDAQ:AMZN',
  '0xe65ff435be42630439c96396653a342829e877e2aafaeaf1a10d0ee5fd2cf3f2':
    'NASDAQ:GOOG',
  '0xd0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1':
    'NASDAQ:MSFT',
  '0x16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1':
    'NASDAQ:TSLA',
  '0x5967c196ca33171a0b2d140ddc6334b998dd71c2ddd85ba7920c35fd6ed20fe9':
    'AMEX:IVV',
}
