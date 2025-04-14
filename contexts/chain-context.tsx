import React from 'react'

import { Chain } from '../model/chain'
import { getChain } from '../constants/chain'

type ChainContext = {
  selectedChain: Chain
}

const Context = React.createContext<ChainContext | null>(null)

export const ChainProvider = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <Context.Provider
      value={{
        selectedChain: getChain(),
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useChainContext = () => React.useContext(Context) as ChainContext
