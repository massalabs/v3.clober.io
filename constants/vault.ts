import { CHAIN_IDS } from '@clober/v2-sdk'
import { zeroAddress, zeroHash } from 'viem'

export const WHITELISTED_VAULTS: {
  [chain in CHAIN_IDS]: {
    token0: `0x${string}`
    token1: `0x${string}`
    salt: `0x${string}`
    key: `0x${string}`
    hasDashboard: boolean
    hasCloberPoint: boolean
    startLPInfo?: {
      quoteAmount: number
      baseAmount: number
      lpAmount: number
      timestamp: number
      priceMultiplier: number
    }
  }[]
} = {
  [CHAIN_IDS.BASE]: [
    {
      // https://basescan.org/tx/0x12dc122f8d1bd78b3f2be55d6e228c9926b4ab0d97bc766bb37e0b7ec8e353ea#eventlog
      token0: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      token1: '0x4200000000000000000000000000000000000006',
      salt: zeroHash,
      key: '0xc8cbe608c82ee9c4c30f01d7c0eefd977538ac396ed34430aa3993bfe0d363ae',
      hasDashboard: true,
      hasCloberPoint: true,
      startLPInfo: {
        quoteAmount: 271.254,
        baseAmount: 0.1,
        lpAmount: 271.254,
        timestamp: 1739260397,
        priceMultiplier: 1,
      },
    },
  ],
  [CHAIN_IDS.MONAD_TESTNET]: [
    {
      token0: '0x0000000000000000000000000000000000000000',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xad46920833ad7a1ba8e74cc241faf9ae4fd3dc4616ad9648b13160f8453e444f',
      hasDashboard: false,
      hasCloberPoint: true,
    },
    {
      token0: '0x0EfeD4D9fB7863ccC7bb392847C08dCd00FE9bE2',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xf3c347e880b6a775f4f69f6db22860636351a70f18857fab2c56dc32835a1627',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0xb2f82D0f38dc453D596Ad40A37799446Cc89274A',
      token1: zeroAddress,
      salt: zeroHash,
      key: '0xebadcf03683413b3fc72a0d16a0a02902db04ee7a3b439de5033e825c1d79380',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0xF62F63169cA4085Af82C3a147475EFDe3EdD4b50',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0x2b4a8f6c598547dede3868e214f4f1e972deff1508ad7667d7556264662a5796',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0xcaeF04f305313080C2538e585089846017193033',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0x65116afff3b0eb0788edf660a17aaded3cde4133046951f162b9a367961365f0',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0xCAfFD292a5c578Dbd4BBff733F1553bF2cD8850c',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xdec76ca485b0114da61f7202e02c6064a2e5877c0419a63e35686a171e65a769',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0x746e48E2CDD8F6D0B672adAc7810f55658dC801b',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0x52a4a317578afd8b6780469407c0d8d22482b30222d38309ddc8f81c9e470f84',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0x5F433CFeB6CB2743481a096a56007a175E12ae23',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xd9ba92f82231516cb23e6019cabcb8a72a4113b70d60b9f1300231a216bc33e3',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0x53E2BB2d88DdC44CC395a0CbCDDC837AeF44116D',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xc3a53552177b7cbf4d69582d3711e1d99b3916b95e191fdf0c5f4a3113052f50',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0xd57e27D90e04eAE2EEcBc63BA28E433098F72855',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0x679ee61a76450c742b3a24d83181f9e2fc20b2208418e726aa956ce74531385a',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0xDB1Aa7232c2fF7bb480823af254453570d0E4A16',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0x7c9740bc2ed0efbd8f8588b3be0325f96fb704928f7a41e14e1f09a1b701d718',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0x24A08695F06A37C8882CD1588442eC40061e597B',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xc026e5e4c3cfa012d7427f236b4a5e8ffc97902ee9fd431d64abd297051127d5',
      hasDashboard: false,
      hasCloberPoint: false,
    },
    {
      token0: '0x41DF9f8a0c014a0ce398A3F2D1af3164ff0F492A',
      token1: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
      salt: zeroHash,
      key: '0xbb3b42c05a4f48b94845b91341a2e5716af9a8625644acfe8e334cfea8993015',
      hasDashboard: false,
      hasCloberPoint: false,
    },
  ],
  [CHAIN_IDS.RISE_SEPOLIA]: [],
}
