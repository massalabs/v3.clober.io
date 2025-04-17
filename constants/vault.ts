import { CHAIN_IDS } from '@clober/v2-sdk'
import { zeroHash } from 'viem'

import { VaultImmutableInfo } from '../model/vault'

export const WHITELISTED_VAULTS: {
  [chain in CHAIN_IDS]: VaultImmutableInfo[]
} = {
  [CHAIN_IDS.BASE]: [
    {
      // https://basescan.org/tx/0x12dc122f8d1bd78b3f2be55d6e228c9926b4ab0d97bc766bb37e0b7ec8e353ea#eventlog
      currencyA: {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x4200000000000000000000000000000000000006',
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
      },
      salt: zeroHash,
      key: '0xc8cbe608c82ee9c4c30f01d7c0eefd977538ac396ed34430aa3993bfe0d363ae',
      hasDashboard: true,
      hasPoint: true,
      initialLPInfo: {
        quoteTokenAmount: 271.254,
        baseTokenAmount: 0.1,
        lpTokenAmount: 271.254,
        timestamp: 1739260397,
      },
    },
  ],
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x0000000000000000000000000000000000000000',
        name: 'Monad Token',
        symbol: 'MON',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xad46920833ad7a1ba8e74cc241faf9ae4fd3dc4616ad9648b13160f8453e444f',
      hasDashboard: false,
      hasPoint: true,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x0EfeD4D9fB7863ccC7bb392847C08dCd00FE9bE2',
        name: 'muBOND',
        symbol: 'muBOND',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xf3c347e880b6a775f4f69f6db22860636351a70f18857fab2c56dc32835a1627',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0x0000000000000000000000000000000000000000',
        name: 'Monad Token',
        symbol: 'MON',
        decimals: 18,
      },
      currencyB: {
        address: '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A',
        name: 'aPriori Monad LST',
        symbol: 'aprMON',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xebadcf03683413b3fc72a0d16a0a02902db04ee7a3b439de5033e825c1d79380',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0xF62F63169cA4085Af82C3a147475EFDe3EdD4b50',
        name: 'Hive Stablecoin',
        symbol: 'HIVE',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0x2b4a8f6c598547dede3868e214f4f1e972deff1508ad7667d7556264662a5796',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0xcaeF04f305313080C2538e585089846017193033',
        name: 'USOILSPOT 2025-05-16',
        symbol: 'USOILSPOT-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0x65116afff3b0eb0788edf660a17aaded3cde4133046951f162b9a367961365f0',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0xCAfFD292a5c578Dbd4BBff733F1553bF2cD8850c',
        name: 'XAU 2025-05-16',
        symbol: 'XAU-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xdec76ca485b0114da61f7202e02c6064a2e5877c0419a63e35686a171e65a769',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x746e48E2CDD8F6D0B672adAc7810f55658dC801b',
        name: 'EUR 2025-05-16',
        symbol: 'EUR-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0x52a4a317578afd8b6780469407c0d8d22482b30222d38309ddc8f81c9e470f84',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x5F433CFeB6CB2743481a096a56007a175E12ae23',
        name: 'BTC 2025-05-16',
        symbol: 'BTC-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xd9ba92f82231516cb23e6019cabcb8a72a4113b70d60b9f1300231a216bc33e3',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x53E2BB2d88DdC44CC395a0CbCDDC837AeF44116D',
        name: 'AAPL 2025-05-16',
        symbol: 'AAPL-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xc3a53552177b7cbf4d69582d3711e1d99b3916b95e191fdf0c5f4a3113052f50',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0xd57e27D90e04eAE2EEcBc63BA28E433098F72855',
        name: 'GOOGL 2025-05-16',
        symbol: 'GOOGL-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0x679ee61a76450c742b3a24d83181f9e2fc20b2208418e726aa956ce74531385a',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0xDB1Aa7232c2fF7bb480823af254453570d0E4A16',
        name: 'TSLA 2025-05-16',
        symbol: 'TSLA-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0x7c9740bc2ed0efbd8f8588b3be0325f96fb704928f7a41e14e1f09a1b701d718',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x24A08695F06A37C8882CD1588442eC40061e597B',
        name: 'BRK-A 2025-05-16',
        symbol: 'BRK-A-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xc026e5e4c3cfa012d7427f236b4a5e8ffc97902ee9fd431d64abd297051127d5',
      hasDashboard: false,
      hasPoint: false,
    },
    {
      currencyA: {
        address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
      },
      currencyB: {
        address: '0x41DF9f8a0c014a0ce398A3F2D1af3164ff0F492A',
        name: 'US30Y 2025-05-16',
        symbol: 'US30Y-250516',
        decimals: 18,
      },
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
      key: '0xbb3b42c05a4f48b94845b91341a2e5716af9a8625644acfe8e334cfea8993015',
      hasDashboard: false,
      hasPoint: false,
    },
  ],
  [CHAIN_IDS.RISE_SEPOLIA]: [],
}
