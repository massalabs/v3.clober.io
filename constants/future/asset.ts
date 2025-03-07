import { getAddress } from 'viem'

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
}

export const WHITE_LISTED_ASSETS: `0x${string}`[] = [
  '0x97ACCeCe4b34f143E94735F197d9f7d62C61B8Da', // AAPL-USDC, Apr 01 25, 09:00
  '0x87Da19f3da65fcc68CF4e8921a30E877Ecd9ea33', // AMZN-USDC, Apr 01 25, 09:00
  '0xdF9357a869e6FB4a75625f77DAD6B40859038735', // BTC-USDC, Apr 01 25, 09:00
  '0xC16a1B1C60E638650bC1CF681dfC13C4D33624EA', // GOOG-USDC, Apr 01 25, 09:00
  '0x9103b71508c3449caa63E7672e0Da2F9204E5025', // MSFT-USDC, Apr 01 25, 09:00
  '0x295d60dCb9fd2D38e2cfE244656b4cBC3F4de583', // TSLA-USDC, Apr 01 25, 09:00
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
}
