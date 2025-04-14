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
    'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-round-500.png',
  '0xe786153cc54abd4b0e53b4c246d54d9f8eb3f3b5a34d4fc5a2e9a423b0ba5d6b':
    'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/MON.png/public',
}

export const WHITE_LISTED_ASSETS: `0x${string}`[] = [
  '0xF8f1B89073E2A8443aE9A2B070AA353545e283c7', /// IVV
  '0x1D074e003E222905e31476A8398e36027141915b', // MON-TGE
].map((address) => getAddress(address))

export const TRADING_VIEW_SYMBOLS: {
  [assetId in string]: string
} = {
  '0x576eef18034939eb62e7736f6f9fb7eb6c67b5c6ed81605f4879057028d734bb':
    'AMEX:IVV',
}
