import { base } from 'viem/chains'
import { createConfig, http } from 'wagmi'

import { Chain } from '../model/chain'

import { RPC_URL } from './rpc-urls'

export const DEFAULT_CHAIN_ID = base.id

export const supportChains: Chain[] = [base]

export const testnetChainIds: number[] = []

export const findSupportChain = (chainId: number): Chain | undefined =>
  supportChains.find((chain) => chain.id === chainId)

export const wagmiConfig = createConfig({
  chains: supportChains as any,
  transports: Object.fromEntries(
    supportChains.map((chain) => [chain.id, http(RPC_URL[chain.id])]),
  ),
})
