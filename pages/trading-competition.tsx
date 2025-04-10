import React, { useEffect } from 'react'
import { monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'
import { TradingCompetitionContainer } from '../containers/trading-competition-container'

export default function TradingCompetition() {
  const { selectedChain, setSelectedChain } = useChainContext()

  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      setSelectedChain(monadTestnet)
      const url = new URL(window.location.href)
      window.history.replaceState({}, '', `${url.origin}${url.pathname}`)
    }
  }, [selectedChain, setSelectedChain])

  return <TradingCompetitionContainer />
}
