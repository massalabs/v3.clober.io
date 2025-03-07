import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { getAddress, isAddressEqual, zeroAddress } from 'viem'
import { getBalance, readContracts } from '@wagmi/core'

import { deduplicateCurrencies } from '../../utils/currency'
import { useCurrencyContext } from '../currency-context'
import { useChainContext } from '../chain-context'
import { fetchFuturePositions } from '../../apis/future/position'
import { UserPosition } from '../../model/future/user-position'
import { monadTestnet } from '../../constants/monad-testnet-chain'
import { fetchFutureAssets } from '../../apis/future/asset'
import { Asset } from '../../model/future/asset'
import { Balances } from '../../model/balances'
import { wagmiConfig } from '../../constants/chain'
import { ERC20_PERMIT_ABI } from '../../abis/@openzeppelin/erc20-permit-abi'

type FutureContext = {
  assets: Asset[]
  positions: UserPosition[]
  futureBalances: Balances
}

const Context = React.createContext<FutureContext>({
  assets: [],
  positions: [],
  futureBalances: {},
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
    queryKey: ['future-positions', userAddress, selectedChain.id, prices],
    queryFn: async () => {
      if (!userAddress) {
        return []
      }
      return fetchFuturePositions(selectedChain.id, userAddress, prices)
    },
    initialData: [],
  }) as {
    data: UserPosition[]
  }

  const { data: futureBalances } = useQuery({
    queryKey: [
      'future-balances',
      selectedChain,
      userAddress,
      assets
        .map((c) => c.currency.address)
        .sort()
        .join(''),
    ],
    queryFn: async () => {
      if (!userAddress || assets.length === 0) {
        return {}
      }
      const uniqueCurrencies = deduplicateCurrencies(
        assets.map((asset) => asset.currency),
      ).filter((currency) => !isAddressEqual(currency.address, zeroAddress))
      const [results, balance] = await Promise.all([
        readContracts(wagmiConfig, {
          contracts: uniqueCurrencies.map((currency) => ({
            chainId: selectedChain.id,
            address: currency.address,
            abi: ERC20_PERMIT_ABI,
            functionName: 'balanceOf',
            args: [userAddress],
          })),
        }),
        getBalance(wagmiConfig, {
          address: userAddress,
          chainId: selectedChain.id,
        }),
      ])
      return results.reduce(
        (acc: {}, { result }, index: number) => {
          const currency = uniqueCurrencies[index]
          return {
            ...acc,
            [getAddress(currency.address)]: result ?? 0n,
            [currency.address.toLowerCase()]: result ?? 0n,
          }
        },
        {
          [zeroAddress]: balance?.value ?? 0n,
        },
      )
    },
    refetchInterval: 5 * 1000, // checked
    refetchIntervalInBackground: true,
  }) as {
    data: Balances
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

  return (
    <Context.Provider value={{ assets, positions, futureBalances }}>
      {children}
    </Context.Provider>
  )
}

export const useFutureContext = () => React.useContext(Context) as FutureContext
