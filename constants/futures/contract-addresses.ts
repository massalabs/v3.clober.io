import { CHAIN_IDS } from '@clober/v2-sdk'
import { getAddress } from 'viem'

export const FUTURES_CONTRACT_ADDRESSES: {
  [chain in CHAIN_IDS]:
    | {
        FuturesMarket: `0x${string}`
        PythOracle: `0x${string}`
        TradingCompetitionRegistration: `0x${string}`
      }
    | undefined
} = {
  [CHAIN_IDS.BASE]: undefined,
  [CHAIN_IDS.MONAD_TESTNET]: {
    FuturesMarket: getAddress('0x181eaedd3C9C6848921867Ea494406Fcd174EAF4'),
    PythOracle: getAddress('0x51b7bf333aa6425B951da4C42105d94F68F6e80E'),
    TradingCompetitionRegistration: getAddress(
      '0x58e84BAc13e19966A17F7Df370d3452bb0c23BF7',
    ),
  },
}
