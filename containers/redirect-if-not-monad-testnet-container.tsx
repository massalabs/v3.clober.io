import React, { useEffect } from 'react'
import { monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'

const RedirectIfNotMonadTestnetContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { selectedChain } = useChainContext()

  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      const url = new URL(window.location.href)
      window.location.href = `${url.origin}`
    }
  }, [selectedChain])

  return <>{selectedChain.id !== monadTestnet.id ? null : children}</>
}

export default RedirectIfNotMonadTestnetContainer
