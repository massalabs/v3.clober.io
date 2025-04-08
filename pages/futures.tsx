import React, { useEffect } from 'react'
import { monadTestnet } from 'viem/chains'

import { FuturesContainer } from '../containers/futures/futures-container'
import { useChainContext } from '../contexts/chain-context'

export default function Futures() {
  const { selectedChain, setSelectedChain } = useChainContext()

  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      setSelectedChain(monadTestnet)
      const url = new URL(window.location.href)
      window.history.replaceState({}, '', `${url.origin}${url.pathname}`)
    }
  }, [selectedChain, setSelectedChain])

  return <FuturesContainer />
}
