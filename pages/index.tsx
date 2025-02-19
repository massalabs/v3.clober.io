import React from 'react'
import { useRouter } from 'next/router'

import { useChainContext } from '../contexts/chain-context'

export default function Home() {
  const { selectedChain } = useChainContext()
  const router = useRouter()

  if (router.pathname === '/') {
    router.push(`/trade?chain=${selectedChain.id}`)
  }
  return <div />
}
