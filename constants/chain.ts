import { base, monadTestnet } from 'viem/chains'
import { createConfig, http } from 'wagmi'
import { CHAIN_IDS } from '@clober/v2-sdk'

import { Chain } from '../model/chain'

import { RPC_URL } from './rpc-url'

export const DEFAULT_CHAIN_ID = base.id

export const supportChains: Chain[] = [
  base,
  {
    ...monadTestnet,
    icon: '/monad.png',
  },
]

export const testnetChainIds: number[] = [monadTestnet.id]

export const findSupportChain = (chainId: CHAIN_IDS): Chain | undefined =>
  supportChains.find((chain) => chain.id === chainId)

export const wagmiConfig = createConfig({
  chains: supportChains as any,
  transports: Object.fromEntries(
    supportChains.map((chain) => [chain.id, http(RPC_URL[chain.id])]),
  ),
})
