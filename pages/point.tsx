import React from 'react'

import { PointContainer } from '../containers/point-container'
import RedirectIfNotMonadTestnetContainer from '../containers/redirect-if-not-monad-testnet-container'

export default function Point() {
  return (
    <RedirectIfNotMonadTestnetContainer>
      <PointContainer />
    </RedirectIfNotMonadTestnetContainer>
  )
}
