import React, { useCallback, useContext, useEffect } from 'react'
import { useAccount } from 'wagmi'

import ConfirmationModal from '../components/modal/confirmation-modal'
import { Currency } from '../model/currency'
import { Chain } from '../model/chain'

export type Confirmation = {
  title: string
  body?: string
  chain?: Chain
  fields: {
    direction?: 'in' | 'out'
    currency?: Currency
    label: string
    value: string
  }[]
}

export type Transaction = Confirmation & {
  txHash: `0x${string}`
  type: string
  timestamp: number
  success: boolean
}

type TransactionContext = {
  confirmation?: Confirmation
  setConfirmation: (confirmation?: Confirmation) => void
  pendingTransactions: Transaction[]
  transactionHistory: Transaction[]
  queuePendingTransaction: (transaction: Transaction) => void
  dequeuePendingTransaction: (txHash: `0x${string}`) => void
}

const Context = React.createContext<TransactionContext>({
  setConfirmation: () => {},
  pendingTransactions: [],
  transactionHistory: [],
  queuePendingTransaction: () => {},
  dequeuePendingTransaction: () => {},
})

export const LOCAL_STORAGE_TRANSACTIONS_KEY = (
  address: `0x${string}`,
  status: 'pending' | 'confirmed',
) => `transactions-${address}-${status}`

export const TransactionProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const [confirmation, setConfirmation] = React.useState<Confirmation>()
  const [pendingTransactions, setPendingTransactions] = React.useState<
    Transaction[]
  >([])
  const [transactionHistory, setTransactionHistory] = React.useState<
    Transaction[]
  >([])

  useEffect(() => {
    setPendingTransactions(
      userAddress
        ? JSON.parse(
            localStorage.getItem(
              LOCAL_STORAGE_TRANSACTIONS_KEY(userAddress, 'pending'),
            ) ?? '[]',
          )
        : [],
    )

    setTransactionHistory(
      userAddress
        ? JSON.parse(
            localStorage.getItem(
              LOCAL_STORAGE_TRANSACTIONS_KEY(userAddress, 'confirmed'),
            ) ?? '[]',
          )
        : [],
    )
  }, [userAddress])

  console.log({ pendingTransactions, transactionHistory })

  const queuePendingTransaction = useCallback(
    (transaction: Transaction) => {
      if (userAddress) {
        setPendingTransactions((previous) => {
          const updatedTransactions = [...previous, transaction]
          localStorage.setItem(
            LOCAL_STORAGE_TRANSACTIONS_KEY(userAddress, 'pending'),
            JSON.stringify(updatedTransactions),
          )
          return updatedTransactions
        })
      }
    },
    [userAddress],
  )

  const dequeuePendingTransaction = useCallback(
    (txHash: `0x${string}`) => {
      const transaction = pendingTransactions.find(
        (transaction) => transaction.txHash === txHash,
      )
      if (userAddress && transaction) {
        setTransactionHistory((previous) => {
          const updatedTransactions = [transaction, ...previous]
          localStorage.setItem(
            LOCAL_STORAGE_TRANSACTIONS_KEY(userAddress, 'confirmed'),
            JSON.stringify(updatedTransactions),
          )
          return updatedTransactions
        })

        setPendingTransactions((previous) => {
          const updatedTransactions = previous.filter(
            (transaction) => transaction.txHash !== txHash,
          )
          localStorage.setItem(
            LOCAL_STORAGE_TRANSACTIONS_KEY(userAddress, 'pending'),
            JSON.stringify(updatedTransactions),
          )
          return updatedTransactions
        })
      }
    },
    [pendingTransactions, userAddress],
  )

  return (
    <Context.Provider
      value={{
        confirmation,
        setConfirmation,
        pendingTransactions,
        transactionHistory,
        queuePendingTransaction,
        dequeuePendingTransaction,
      }}
    >
      {children}
      <ConfirmationModal confirmation={confirmation} />
    </Context.Provider>
  )
}

export function useTransactionContext() {
  return useContext(Context) as TransactionContext
}
