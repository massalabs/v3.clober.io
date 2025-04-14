import { base, monadTestnet } from 'viem/chains'

import { Chain } from '../model/chain'

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
