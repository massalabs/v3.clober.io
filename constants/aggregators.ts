import { CHAIN_IDS } from '@clober/v2-sdk'
import { getAddress } from 'viem'

import { Aggregator } from '../model/aggregator'
import { OdosAggregator } from '../model/aggregator/odos'
import { MagpieAggregator } from '../model/aggregator/magpie'
import { OpenOceanAggregator } from '../model/aggregator/openocean'

import { findSupportChain } from './chain'

export const AGGREGATORS: {
  [chain in number]: Aggregator[]
} = {
  [CHAIN_IDS.BASE]: [
    new OdosAggregator(
      getAddress('0x19cEeAd7105607Cd444F5ad10dd51356436095a1'),
      findSupportChain(CHAIN_IDS.BASE.valueOf())!,
    ),
    new MagpieAggregator(
      getAddress('0xef42f78d25f4c681dcad2597fa04877ff802ef4b'),
      findSupportChain(CHAIN_IDS.BASE.valueOf())!,
    ),
  ],
  [CHAIN_IDS.MONAD_TESTNET]: [
    // new CloberV2Aggregator(
    //   findSupportChain(CHAIN_IDS.MONAD_TESTNET.valueOf())!,
    // ),
    new OpenOceanAggregator(
      getAddress('0x6352a56caadC4F1E25CD6c75970Fa768A3304e64'),
      findSupportChain(CHAIN_IDS.MONAD_TESTNET.valueOf())!,
    ),
  ],
}
