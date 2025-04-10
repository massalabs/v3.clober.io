import React, { useEffect } from 'react'
import { monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'
import { TradingCompetitionContainer } from '../containers/trading-competition-container'

export default function TradingCompetition() {
  const { selectedChain } = useChainContext()

  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      const url = new URL(window.location.href)
      window.location.href = `${url.origin}`
    }
  }, [selectedChain])

  return <TradingCompetitionContainer />
}
