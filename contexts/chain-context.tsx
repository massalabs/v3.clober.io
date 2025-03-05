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
import { WALLET_WARNING_MODAL_START_TIMESTAMP } from '../utils/transaction'
import { currentTimestampInSeconds } from '../utils/date'

import { useTransactionContext } from './transaction-context'

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
  const { setConfirmation } = useTransactionContext()
  const [selectedChain, _setSelectedChain] = React.useState<Chain>(
    supportChains.find((chain) => chain.id === DEFAULT_CHAIN_ID)!,
  )
  const { chainId } = useAccount()

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
          const provider = window.ethereum
          if (provider) {
            try {
              const chain =
                data && data.chainId
                  ? findSupportChain(data.chainId)
                  : undefined
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

  const now = currentTimestampInSeconds()
  useEffect(() => {
    const action = async () => {
      const startTimestamp = Number(
        localStorage.getItem(WALLET_WARNING_MODAL_START_TIMESTAMP) ?? '0',
      )
      if (now - startTimestamp < 5) {
        setConfirmation({
          title: 'Connected to the wrong chain',
          body: [
            'The current chain is different from the one connected to your wallet.',
            // eslint-disable-next-line react/jsx-key
            <br />,
            'If this message doesn’t disappear after 5 seconds, please refresh the page.',
            // eslint-disable-next-line react/jsx-key
            <br />,
            'Should the message appear multiple times, please change the chain in your wallet.',
          ] as any,
          fields: [],
          chain: selectedChain,
        })

        await new Promise((resolve) => setTimeout(resolve, 5000))
        window.location.reload()
      }
    }

    action()
  }, [now, selectedChain, setConfirmation])

  return (
    <Context.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </Context.Provider>
  )
}

export const useChainContext = () => React.useContext(Context) as ChainContext
