import React, { useCallback, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

import { Chain } from '../model/chain'
import {
  DEFAULT_CHAIN_ID,
  findSupportChain,
  supportChains,
  wagmiConfig,
} from '../constants/chain'

type ChainContext = {
  selectedChain: Chain
  setSelectedChain: (chain: Chain) => void
}

const Context = React.createContext<ChainContext>({
  selectedChain: supportChains.find((chain) => chain.id === DEFAULT_CHAIN_ID)!,
  setSelectedChain: (_) => _,
})

export const LOCAL_STORAGE_CHAIN_KEY = 'chain'
const QUERY_PARAM_CHAIN_KEY = 'chain'

export const ChainProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [selectedChain, _setSelectedChain] = React.useState<Chain>(
    supportChains.find((chain) => chain.id === DEFAULT_CHAIN_ID)!,
  )
  const { chainId } = useAccount()

  const { switchChain } = useSwitchChain({
    config: wagmiConfig,
    mutation: {
      onError: async (error) => {
        if (
          error &&
          error.toString().includes('SwitchChainNotSupportedError') &&
          localStorage.getItem(LOCAL_STORAGE_CHAIN_KEY)
        ) {
          const provider = window.ethereum
          if (provider) {
            try {
              const chainId = parseInt(
                localStorage.getItem(LOCAL_STORAGE_CHAIN_KEY)!,
              )
              await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
              })
            } catch (e) {
              console.error('wallet_switchEthereumChain error', e)
            }
          }
        }
      },
    },
  })

  const setSelectedChain = useCallback(
    (_chain: Chain) => {
      _setSelectedChain(_chain)
      localStorage.setItem(LOCAL_STORAGE_CHAIN_KEY, _chain.id.toString())
      if (switchChain) {
        try {
          switchChain({ chainId: _chain.id })
          window.history.replaceState({}, '', `?chain=${_chain.id}`)
        } catch (e) {
          console.error('switchChain error', e)
        }
      }
    },
    [switchChain],
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryParamChain = params.get(QUERY_PARAM_CHAIN_KEY)
      ? findSupportChain(parseInt(params.get(QUERY_PARAM_CHAIN_KEY)!, 10))
      : undefined
    const localStorageChain = localStorage.getItem(LOCAL_STORAGE_CHAIN_KEY)
      ? findSupportChain(
          parseInt(localStorage.getItem(LOCAL_STORAGE_CHAIN_KEY)!, 10),
        )
      : undefined
    const walletConnectedChain = chainId ? findSupportChain(chainId) : undefined

    console.log({
      context: 'chain',
      walletConnectedChainId: walletConnectedChain?.id,
      queryParamChainId: queryParamChain?.id,
      localStorageChainId: localStorageChain?.id,
    })
    const chain = walletConnectedChain || queryParamChain || localStorageChain
    if (chain) {
      setSelectedChain(chain)
    }
  }, [chainId, setSelectedChain])

  return (
    <Context.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </Context.Provider>
  )
}

export const useChainContext = () => React.useContext(Context) as ChainContext
