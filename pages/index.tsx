import React from 'react'
import { useRouter } from 'next/router'
import { monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'

export default function Home() {
  const { selectedChain } = useChainContext()
  const router = useRouter()
  const url = window.location.href

  if (router.pathname === '/') {
    // TODO: remove this after the future page is ready
    if (url.includes('futures.clober.io')) {
      router.push(`/future?chain=${monadTestnet.id}`)
    } else {
      router.push(`/trade?chain=${selectedChain.id}`)
    }
  }
  return <div />
}
