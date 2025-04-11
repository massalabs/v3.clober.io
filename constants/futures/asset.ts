import { getAddress } from 'viem'

export const MARKET_HOURS: {
  [assetId in string]: {
    open: number
    close: number
  }
} = {
  '0x576eef18034939eb62e7736f6f9fb7eb6c67b5c6ed81605f4879057028d734bb': {
    open: 1430,
    close: 2100,
  },
}

export const ASSET_ICONS: {
  [assetId in string]: string
} = {
  '0x576eef18034939eb62e7736f6f9fb7eb6c67b5c6ed81605f4879057028d734bb':
    'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-ivv-usd.inline.svg&w=3840&q=75',
}

export const WHITE_LISTED_ASSETS: `0x${string}`[] = [
  '0xAA290e3dF658269705D6C4F63FdE0f13E02e85B8', /// IVV
].map((address) => getAddress(address))

export const TRADING_VIEW_SYMBOLS: {
  [assetId in string]: string
} = {
  '0x576eef18034939eb62e7736f6f9fb7eb6c67b5c6ed81605f4879057028d734bb':
    'AMEX:IVV',
}
