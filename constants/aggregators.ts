import { CHAIN_IDS } from '@clober/v2-sdk'
import { getAddress } from 'viem'

import { Aggregator } from '../model/aggregator'
import { OdosAggregator } from '../model/aggregator/odos'

import { findSupportChain } from './chain'

export const AGGREGATORS: {
  [chain in number]: Aggregator[]
} = {
  [CHAIN_IDS.BASE]: [
    new OdosAggregator(
      getAddress('0x19cEeAd7105607Cd444F5ad10dd51356436095a1'),
      findSupportChain(CHAIN_IDS.BASE.valueOf())!,
    ),
    // new MagpieAggregator(
    //   getAddress('0xef42f78d25f4c681dcad2597fa04877ff802ef4b'),
    //   findSupportChain(CHAIN_IDS.BASE.valueOf())!,
    // ),
  ],
  [CHAIN_IDS.MONAD_TESTNET]: [
    // new CloberV2Aggregator(
    //   findSupportChain(CHAIN_IDS.MONAD_TESTNET.valueOf())!,
    // ),
  ],
}
