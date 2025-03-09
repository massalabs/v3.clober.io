import { zeroAddress } from 'viem'
import { CHAIN_IDS } from '@clober/v2-sdk'

import { Currency } from '../model/currency'

export const WETH: {
  [chain in number]: Currency
} = {
  [CHAIN_IDS.BASE]: {
    address: '0x4200000000000000000000000000000000000006',
    name: 'Wrapped ETH',
    symbol: 'WETH',
    decimals: 18,
  },
  [CHAIN_IDS.MONAD_TESTNET]: {
    address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
    name: 'Wrapped Monad Token',
    symbol: 'WMON',
    decimals: 18,
  },
}

export const ETH: Currency = {
  address: zeroAddress,
  name: 'Ethereum',
  symbol: 'ETH',
  decimals: 18,
  icon: 'https://assets.odos.xyz/tokens/ETH.webp',
}

const MON: Currency = {
  address: zeroAddress,
  name: 'Monad Token',
  symbol: 'MON',
  decimals: 18,
  icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/MON.png/public',
}

export const WHITELISTED_CURRENCIES: {
  [chain in number]: Currency[]
} = {
  [CHAIN_IDS.BASE]: [ETH],
  [CHAIN_IDS.MONAD_TESTNET]: [
    MON,
    {
      address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
      name: 'Clober Test USD Coin',
      symbol: 'MOCKB',
      decimals: 6,
    },
    {
      address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
      name: 'Wrapped Monad Token',
      symbol: 'WMON',
      decimals: 18,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public',
    },
    {
      address: '0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714',
      name: 'Molandak',
      symbol: 'DAK',
      decimals: 18,
      icon: 'https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/27759359-9374-4995-341c-b2636a432800/public',
    },
    {
      address: '0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50',
      name: 'Moyaki',
      symbol: 'YAKI',
      decimals: 18,
      icon: 'https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/6679b698-a845-412b-504b-23463a3e1900/public',
    },
    {
      address: '0xE0590015A873bF326bd645c3E1266d4db41C4E6B',
      name: 'Chog',
      symbol: 'CHOG',
      decimals: 18,
      icon: 'https://imagedelivery.net/tWwhAahBw7afBzFUrX5mYQ/5d1206c2-042c-4edc-9f8b-dcef2e9e8f00/public',
    },
    {
      address: '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A',
      name: 'aPriori Monad LST',
      symbol: 'aprMON',
      decimals: 18,
      icon: 'https://pbs.twimg.com/profile_images/1821177411796410369/GtzmUXok_400x400.jpg',
    },
    {
      address: '0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3',
      name: 'gMON',
      symbol: 'gMON',
      decimals: 18,
      icon: 'https://www.magmastaking.xyz/gMON.png',
    },
    {
      address: '0x07AabD925866E8353407E67C1D157836f7Ad923e',
      name: 'StakedMonad',
      symbol: 'sMON',
      decimals: 18,
      icon: 'https://kintsu-logos.s3.us-east-1.amazonaws.com/sMON.svg',
    },
    {
      address: '0x3a98250F98Dd388C211206983453837C8365BDc1',
      name: 'ShMonad',
      symbol: 'shMON',
      decimals: 18,
      icon: 'https://i.imghippo.com/files/Osf1224Egs.png',
    },
    {
      address: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/images.png/public',
    },
    {
      address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
      name: 'Wrapped ETH',
      symbol: 'WETH',
      decimals: 18,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/weth.jpg/public',
    },
    {
      address: '0xcf5a6076cfa32686c0Df13aBaDa2b40dec133F1d',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/wbtc.png/public',
    },
    {
      address: '0x5387C85A4965769f6B0Df430638a1388493486F1',
      name: 'Wrapped SOL',
      symbol: 'WSOL',
      decimals: 9,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/sol.png/public',
    },
    {
      address: '0x97ACCeCe4b34f143E94735F197d9f7d62C61B8Da',
      name: 'APPL',
      symbol: 'APPL',
      decimals: 18,
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-aapl-usd.inline.svg&w=1920&q=75',
    },
    {
      address: '0x87Da19f3da65fcc68CF4e8921a30E877Ecd9ea33',
      name: 'AMZN',
      symbol: 'AMZN',
      decimals: 18,
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-amzn-usd.inline.svg&w=1920&q=75',
    },
    {
      address: '0xC16a1B1C60E638650bC1CF681dfC13C4D33624EA',
      name: 'GOOG',
      symbol: 'GOOG',
      decimals: 18,
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-goog-usd.inline.svg&w=1920&q=75',
    },
    {
      address: '0x9103b71508c3449caa63E7672e0Da2F9204E5025',
      name: 'MSFT',
      symbol: 'MSFT',
      decimals: 18,
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-msft-usd.inline.svg&w=1920&q=75',
    },
    {
      address: '0x295d60dCb9fd2D38e2cfE244656b4cBC3F4de583',
      name: 'TSLA',
      symbol: 'TSLA',
      decimals: 18,
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-tsla-usd.inline.svg&w=1920&q=75',
    },
  ],
}

export const DEFAULT_INPUT_CURRENCY: {
  [chain in number]: Currency
} = {
  [CHAIN_IDS.BASE]: {
    address: '0x4200000000000000000000000000000000000006',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  [CHAIN_IDS.MONAD_TESTNET]: {
    address: zeroAddress,
    name: 'Monad Token',
    symbol: 'MON',
    decimals: 18,
    icon: '/monad.png',
  },
}

export const DEFAULT_OUTPUT_CURRENCY: {
  [chain in number]: Currency
} = {
  [CHAIN_IDS.BASE]: {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  [CHAIN_IDS.MONAD_TESTNET]: {
    address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
}
