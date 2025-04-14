import React from 'react'

import { FuturesContainer } from '../containers/futures/futures-container'
import RedirectIfNotMonadTestnetContainer from '../containers/redirect-if-not-monad-testnet-container'

export default function Futures() {
  return (
    <RedirectIfNotMonadTestnetContainer>
      <FuturesContainer />
    </RedirectIfNotMonadTestnetContainer>
  )
}
