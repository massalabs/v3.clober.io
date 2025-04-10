import React, { useEffect } from 'react'
import { monadTestnet } from 'viem/chains'

import { PointContainer } from '../containers/point-container'
import { useChainContext } from '../contexts/chain-context'

export default function Point() {
  const { selectedChain } = useChainContext()

  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      const url = new URL(window.location.href)
      window.location.href = `${url.origin}`
    }
  }, [selectedChain])

  return <PointContainer />
}
