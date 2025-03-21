import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { isAddress, isAddressEqual } from 'viem'

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
  queuePendingPositionCurrencyAddress: (
    positionCurrencyAddress: `0x${string}` | undefined,
  ) => void
  dequeuePendingPositionCurrencyAddress: (
    positionCurrencyAddress: `0x${string}` | undefined,
  ) => void
  pendingPositionCurrencyAddresses: `0x${string}`[]
}

const Context = React.createContext<FutureContext>({
  assets: [],
  positions: [],
  queuePendingPositionCurrencyAddress: () => {},
  dequeuePendingPositionCurrencyAddress: () => {},
  pendingPositionCurrencyAddresses: [],
})

export const LOCAL_STORAGE_PENDING_POSITIONS_KEY = (address: `0x${string}`) =>
  `pending-positions-${address}`

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
  const [
    pendingPositionCurrencyAddresses,
    setPendingPositionCurrencyAddresses,
  ] = React.useState<`0x${string}`[]>([])

  useEffect(() => {
    if (userAddress) {
      setPendingPositionCurrencyAddresses(
        JSON.parse(
          localStorage.getItem(
            LOCAL_STORAGE_PENDING_POSITIONS_KEY(userAddress),
          ) ?? '[]',
        ) as `0x${string}`[],
      )
    }
  }, [userAddress])

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

  const queuePendingPositionCurrencyAddress = React.useCallback(
    (positionCurrencyAddress: `0x${string}` | undefined) => {
      if (
        userAddress &&
        positionCurrencyAddress &&
        isAddress(positionCurrencyAddress)
      ) {
        setPendingPositionCurrencyAddresses((previous) => {
          const updatedPositions = [...previous, positionCurrencyAddress]
          localStorage.setItem(
            LOCAL_STORAGE_PENDING_POSITIONS_KEY(userAddress),
            JSON.stringify(updatedPositions),
          )
          return updatedPositions
        })
      }
    },
    [userAddress],
  )

  const dequeuePendingPositionCurrencyAddress = React.useCallback(
    (positionCurrencyAddress: `0x${string}` | undefined) => {
      if (
        userAddress &&
        positionCurrencyAddress &&
        isAddress(positionCurrencyAddress)
      ) {
        setPendingPositionCurrencyAddresses((previous) => {
          const updatedPositionCurrencyAddresses = previous.filter(
            (address) => !isAddressEqual(address, positionCurrencyAddress),
          )
          localStorage.setItem(
            LOCAL_STORAGE_PENDING_POSITIONS_KEY(userAddress),
            JSON.stringify(updatedPositionCurrencyAddresses),
          )
          return updatedPositionCurrencyAddresses
        })
      }
    },
    [userAddress],
  )

  console.log({ pendingPositionCurrencyAddresses })

  return (
    <Context.Provider
      value={{
        assets,
        positions,
        queuePendingPositionCurrencyAddress,
        dequeuePendingPositionCurrencyAddress,
        pendingPositionCurrencyAddresses,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useFutureContext = () => React.useContext(Context) as FutureContext
