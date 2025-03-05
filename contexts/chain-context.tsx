import React, { useCallback, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { hexValue } from '@ethersproject/bytes'
import { SwitchChainErrorType } from '@wagmi/core'

import { Chain } from '../model/chain'
import {
  DEFAULT_CHAIN_ID,
  findSupportChain,
  supportChains,
  wagmiConfig,
} from '../constants/chain'
import Modal from '../components/modal/modal'

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
  const [connectedWrongChain, setConnectedWrongChain] =
    React.useState<boolean>(false)
  const { chainId, connector } = useAccount()

  const { switchChain } = useSwitchChain({
    config: wagmiConfig,
    mutation: {
      onSuccess: (data) => {
        const chain = data && data.id ? findSupportChain(data.id) : undefined
        if (chain) {
          _setSelectedChain(chain)
          localStorage.setItem(LOCAL_STORAGE_CHAIN_KEY, chain.id.toString())
        }
      },
      onError: async (type: SwitchChainErrorType, data) => {
        if (type.name === 'SwitchChainNotSupportedError') {
          const chain =
            data && data.chainId ? findSupportChain(data.chainId) : undefined
          const provider = window.ethereum
          if (provider) {
            try {
              if (chain) {
                await provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: hexValue(chain.id) }],
                })
                _setSelectedChain(chain)
                localStorage.setItem(
                  LOCAL_STORAGE_CHAIN_KEY,
                  chain.id.toString(),
                )
              }
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
      if (switchChain) {
        try {
          switchChain({ chainId: _chain.id })
        } catch (e) {
          console.error('switchChain error', e)
        }
      } else {
        _setSelectedChain(_chain)
        localStorage.setItem(LOCAL_STORAGE_CHAIN_KEY, _chain.id.toString())
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

  useEffect(() => {
    if (chainId && chainId !== selectedChain.id) {
      setConnectedWrongChain(true)
    } else {
      setConnectedWrongChain(false)
    }
  }, [chainId, selectedChain.id])

  return (
    <Context.Provider value={{ selectedChain, setSelectedChain }}>
      {connectedWrongChain ? (
        <Modal
          show
          onClose={() => {}}
          onButtonClick={() => window.location.reload()}
        >
          <div className="flex flex-col gap-4">
            <h1 className="font-bold sm:text-xl">
              Connected to the wrong chain
            </h1>
            <div className="text-xs sm:text-sm text-gray-400">
              The current chain is different from the one connected to your
              wallet. If this message doesn’t disappear after a moment, please
              switch to the,{' '}
              <span className="font-semibold text-gray-100">
                please switch to the {selectedChain.name} in your{' '}
                {connector?.name ?? ''}.
              </span>{' '}
              If this issue occurs frequently, please use{' '}
              <span className="font-bold text-blue-500 underline">
                <a href="https://rabby.io" target="_blank" rel="noreferrer">
                  rabby wallet
                </a>
              </span>
              .
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {children}
    </Context.Provider>
  )
}

export const useChainContext = () => React.useContext(Context) as ChainContext
