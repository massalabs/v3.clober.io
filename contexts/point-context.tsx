import React, { useContext } from 'react'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'

import { fetchLiquidVaultPoint } from '../apis/point'
import { LiquidityVaultPoint } from '../model/liquidity-vault-point'

import { useChainContext } from './chain-context'

type PointContext = {
  myVaultPoint: LiquidityVaultPoint | null
}

const Context = React.createContext<PointContext>({
  myVaultPoint: null,
})

export const PointProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { selectedChain } = useChainContext()
  const { address: userAddress } = useAccount()

  const { data: myVaultPoint } = useQuery({
    queryKey: ['my-vault-point', selectedChain.id, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        return null
      }
      return fetchLiquidVaultPoint(selectedChain.id, userAddress)
    },
    initialData: null,
  }) as {
    data: LiquidityVaultPoint | null
  }

  return (
    <Context.Provider value={{ myVaultPoint }}>{children}</Context.Provider>
  )
}

export function usePointContext() {
  return useContext(Context) as PointContext
}
