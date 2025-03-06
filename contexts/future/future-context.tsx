import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { deduplicateCurrencies } from '../../utils/currency'
import { useCurrencyContext } from '../currency-context'
import { useChainContext } from '../chain-context'
import { fetchFuturePosition } from '../../apis/future/position'
import { UserPosition } from '../../model/future/user-position'
import { monadTestnet } from '../../constants/monad-testnet-chain'

type FutureContext = {
  positions: UserPosition[]
}

const Context = React.createContext<FutureContext>({
  positions: [],
})

export const FutureProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { selectedChain, setSelectedChain } = useChainContext()
  const { prices } = useCurrencyContext()
  const { address: userAddress } = useAccount()
  const { setCurrencies, whitelistCurrencies } = useCurrencyContext()

  const { data: positions } = useQuery({
    queryKey: ['future-positions', userAddress, selectedChain.id, prices],
    queryFn: async () => {
      if (!userAddress) {
        return []
      }
      return fetchFuturePosition(userAddress, prices)
    },
    initialData: [],
  }) as {
    data: UserPosition[]
  }

  // TODO: remove this after testnet
  useEffect(() => {
    if (selectedChain.id !== monadTestnet.id) {
      setSelectedChain(monadTestnet)
      const url = new URL(window.location.href)
      window.history.replaceState({}, '', `${url.origin}${url.pathname}`)
    }
  }, [selectedChain, setSelectedChain])

  useEffect(() => {
    const action = async () => {
      setCurrencies(deduplicateCurrencies(whitelistCurrencies))
    }
    action()
  }, [setCurrencies, whitelistCurrencies])

  return <Context.Provider value={{ positions }}>{children}</Context.Provider>
}

export const useFutureContext = () => React.useContext(Context) as FutureContext
