import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { deduplicateCurrencies } from '../../utils/currency'
import { useCurrencyContext } from '../currency-context'
import { useChainContext } from '../chain-context'
import { fetchFuturePositions } from '../../apis/future/position'
import { UserPosition } from '../../model/future/user-position'
import { monadTestnet } from '../../constants/monad-testnet-chain'
import { fetchFutureAssets } from '../../apis/future/asset'
import { Asset } from '../../model/future/asset'

type FutureContext = {
  assets: Asset[]
  positions: UserPosition[]
}

const Context = React.createContext<FutureContext>({
  assets: [],
  positions: [],
})

export const FutureProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { selectedChain, setSelectedChain } = useChainContext()
  const { prices } = useCurrencyContext()
  const { address: userAddress } = useAccount()
  const { setCurrencies, whitelistCurrencies } = useCurrencyContext()

  const { data: assets } = useQuery({
    queryKey: ['future-assets', selectedChain.id],
    queryFn: async () => {
      return fetchFutureAssets(selectedChain.id)
    },
    initialData: [],
  }) as {
    data: Asset[]
  }

  const { data: positions } = useQuery({
    queryKey: ['future-positions', userAddress, selectedChain.id],
    queryFn: async () => {
      if (!userAddress) {
        return []
      }
      return fetchFuturePositions(selectedChain.id, userAddress, prices)
    },
    initialData: [],
    refetchIntervalInBackground: true,
    refetchInterval: 2 * 1000, // checked
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
    setCurrencies(
      deduplicateCurrencies([
        ...whitelistCurrencies,
        ...assets.map((asset) => asset.currency),
        ...assets.map((asset) => asset.collateral),
      ]),
    )
  }, [assets, setCurrencies, whitelistCurrencies])

  return (
    <Context.Provider
      value={{
        assets,
        positions,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useFutureContext = () => React.useContext(Context) as FutureContext
