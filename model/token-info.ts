export type TokenInfo = {
  imageUrl: string
  fdv: number
  marketCap: number
  info: {
    website: string
    twitter: string
    telegram: string
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  priceNative: number
  priceUsd: number
  pairAddress: `0x${string}` | undefined
}

export const DEFAULT_TOKEN_INFO: TokenInfo = {
  imageUrl: '',
  fdv: 0,
  marketCap: 0,
  info: {
    website: '',
    twitter: '',
    telegram: '',
  },
  volume: {
    h24: 0,
    h6: 0,
    h1: 0,
    m5: 0,
  },
  liquidity: {
    usd: 0,
    base: 0,
    quote: 0,
  },
  priceNative: 0,
  priceUsd: 0,
  pairAddress: undefined,
}
