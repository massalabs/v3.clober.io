import React from 'react'

import { TradingCompetitionContainer } from '../containers/trading-competition-container'
import RedirectIfNotMonadTestnetContainer from '../containers/redirect-if-not-monad-testnet-container'

export default function TradingCompetition() {
  return (
    <RedirectIfNotMonadTestnetContainer>
      <TradingCompetitionContainer />
    </RedirectIfNotMonadTestnetContainer>
  )
}
