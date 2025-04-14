import { zeroAddress } from 'viem'
import { CHAIN_IDS } from '@clober/v2-sdk'

import { Currency } from '../model/currency'

export const PRICE_FEED_ID_LIST: {
  [chain in CHAIN_IDS]: {
    priceFeedId: `0x${string}`
    address: `0x${string}`
  }[]
} = {
  [CHAIN_IDS.BASE]: [],
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      address: '0x836047a99e11f376522b447bffb6e3495dd0637c', // oWETH
      priceFeedId:
        '0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6',
    },
    {
      address: '0xA296f47E8Ff895Ed7A092b4a9498bb13C46ac768', // wWETH
      priceFeedId:
        '0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6',
    },
    {
      address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37', // WETH
      priceFeedId:
        '0xca80ba6dc32e08d06f1aa886011eed1d77c77be9eb761cc10d72b7d0a2fd57a6',
    },
    {
      address: '0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D', // USDT
      priceFeedId:
        '0x1fc18861232290221461220bd4e2acd1dcdfbc89c84092c93c18bdc7756c1588',
    },
    {
      address: '0xF8f1B89073E2A8443aE9A2B070AA353545e283c7', // IVV
      priceFeedId:
        '0x576eef18034939eb62e7736f6f9fb7eb6c67b5c6ed81605f4879057028d734bb',
    },
    {
      address: '0x1D074e003E222905e31476A8398e36027141915b', // MON-TGE
      priceFeedId:
        '0xe786153cc54abd4b0e53b4c246d54d9f8eb3f3b5a34d4fc5a2e9a423b0ba5d6b',
    },
    {
      address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea', // USDC
      priceFeedId:
        '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722',
    },
    {
      address: '0xF62F63169cA4085Af82C3a147475EFDe3EdD4b50', // HIVE
      priceFeedId:
        '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722',
    },
    {
      address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795', // MOCKB
      priceFeedId:
        '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722',
    },
  ],
}

export const WETH: {
  [chain in CHAIN_IDS]: Currency
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

export const WHITELISTED_CURRENCIES: {
  [chain in CHAIN_IDS]: Currency[]
} = {
  [CHAIN_IDS.BASE]: [
    {
      address: zeroAddress,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      icon: 'https://assets.odos.xyz/tokens/ETH.webp',
    },
  ],
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      address: zeroAddress,
      name: 'Monad Token',
      symbol: 'MON',
      decimals: 18,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/MON.png/public',
    },
    {
      address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      address: '0xF8f1B89073E2A8443aE9A2B070AA353545e283c7',
      name: 'S&P 500 2025-07-01',
      symbol: 'S&P500-250701',
      decimals: 18,
      icon: 'https://cdn.countryflags.com/thumbs/united-states-of-america/flag-round-500.png',
    },
    {
      address: '0x1D074e003E222905e31476A8398e36027141915b',
      name: 'Monad Pre-TGE Futures',
      symbol: 'MON-TGE',
      decimals: 18,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/I_t8rg_V_400x400.jpg/public',
    },
    {
      address: '0x836047a99e11f376522b447bffb6e3495dd0637c',
      name: 'Orbiter Wrapped ETH',
      symbol: 'oWETH',
      decimals: 18,
      icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/weth.jpg/public',
    },
    {
      address: '0x0EfeD4D9fB7863ccC7bb392847C08dCd00FE9bE2',
      name: 'muBOND',
      symbol: 'muBOND',
      decimals: 18,
      icon: '/mubond.svg',
    },
    {
      address: '0xA296f47E8Ff895Ed7A092b4a9498bb13C46ac768',
      name: 'Wormhole Wrapped ETH',
      symbol: 'wWETH',
      decimals: 18,
      icon: 'https://assets.coingecko.com/coins/images/22990/standard/ETH_wh_small.png?1696522286',
    },
    {
      address: '0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      address: '0xF62F63169cA4085Af82C3a147475EFDe3EdD4b50',
      name: 'Hive Stablecoin',
      symbol: 'HIVE',
      decimals: 18,
      icon: '/hive-usd.png',
    },
    {
      address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
      name: 'MockB',
      symbol: 'MOCKB',
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
      address: '0x3B37b6D72c8149b35F160cdd87f974dd293a094A',
      name: 'RWAGMI',
      symbol: 'RWAGMI',
      decimals: 18,
      icon: 'https://storage.nadapp.net/coin/75fe7f11-4c82-45aa-8ea8-806eb1134592',
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
  ],
}

export const DEFAULT_INPUT_CURRENCY: {
  [chain in CHAIN_IDS]: Currency
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
  [chain in CHAIN_IDS]: Currency
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
