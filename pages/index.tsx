import React from 'react'
import { useRouter } from 'next/router'

import { useChainContext } from '../contexts/chain-context'
import { monadTestnet } from '../constants/monad-testnet-chain'

export default function Home() {
  const { selectedChain, setSelectedChain } = useChainContext()
  const router = useRouter()
  const url = window.location.href

  if (url.includes('futures.clober.io')) {
    setSelectedChain(monadTestnet)
    router.push(`/future?chain=${monadTestnet.id}`)
  } else if (router.pathname === '/') {
    router.push(`/trade?chain=${selectedChain.id}`)
  }
  return <div />
}
