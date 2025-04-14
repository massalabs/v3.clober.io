import React from 'react'

import { DiscoverContainer } from '../containers/discover-container'
import RedirectIfNotMonadTestnetContainer from '../containers/redirect-if-not-monad-testnet-container'

export default function Discover() {
  return (
    <RedirectIfNotMonadTestnetContainer>
      <DiscoverContainer />
    </RedirectIfNotMonadTestnetContainer>
  )
}
