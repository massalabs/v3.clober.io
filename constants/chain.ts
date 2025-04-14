import { base, monadTestnet } from 'viem/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'

import { Chain } from '../model/chain'

import { RPC_URL } from './rpc-url'

let config: any | null = null

export const getChain = (): Chain => {
  const url = window.location.href
  const _monadTestnet: Chain = {
    ...monadTestnet,
    icon: '/monad.png',
  }
  if (url.includes('alpha.clober.io')) {
    return _monadTestnet
  } else if (url.includes('base.clober.io')) {
    return base
  }
  // else if (url.includes('rise.clober.io')) {
  //   return 11155931 // todo
  // }
  return _monadTestnet
}

export const getClientConfig = () => {
  if (typeof window === 'undefined') {
    return null
  }
  if (config) {
    return config
  }

  const chain = getChain()
  config = getDefaultConfig({
    appName: 'Clober',
    projectId: '14e09398dd595b0d1dccabf414ac4531',
    chains: [chain],
    transports: {
      [chain.id]: http(RPC_URL[chain.id]),
    },
  })

  return config
}
