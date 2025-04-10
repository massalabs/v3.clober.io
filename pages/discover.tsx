import React, { useEffect } from 'react'
import { monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'
import { DiscoverContainer } from '../containers/discover-container'

export default function Discover() {
  const { selectedChain } = useChainContext()

  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      const url = new URL(window.location.href)
      window.location.href = `${url.origin}`
    }
  }, [selectedChain])

  return <DiscoverContainer />
}
