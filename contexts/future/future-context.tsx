import React, { useEffect } from 'react'

import { deduplicateCurrencies } from '../../utils/currency'
import { useCurrencyContext } from '../currency-context'

type FutureContext = {}

const Context = React.createContext<FutureContext>({})

export const FutureProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { setCurrencies, whitelistCurrencies } = useCurrencyContext()

  useEffect(() => {
    const action = async () => {
      setCurrencies(deduplicateCurrencies(whitelistCurrencies))
    }
    action()
  }, [setCurrencies, whitelistCurrencies])

  return <Context.Provider value={{}}>{children}</Context.Provider>
}

export const useFutureContext = () => React.useContext(Context) as FutureContext
