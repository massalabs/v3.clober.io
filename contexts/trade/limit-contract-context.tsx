import React, { useCallback, useEffect } from 'react'
import { useDisconnect, useWalletClient } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { getAddress, isAddressEqual, parseUnits, zeroAddress } from 'viem'
import {
  cancelOrders,
  claimOrders,
  getContractAddresses,
  limitOrder,
  Market,
  openMarket,
  OpenOrder,
  setApprovalOfOpenOrdersForAll,
} from '@clober/v2-sdk'

import { useChainContext } from '../chain-context'
import { Currency } from '../../model/currency'
import { Confirmation, useTransactionContext } from '../transaction-context'
import { sendTransaction, waitTransaction } from '../../utils/transaction'
import { RPC_URL } from '../../constants/rpc-urls'
import { useCurrencyContext } from '../currency-context'
import { maxApprove } from '../../utils/approve20'
import { toPlacesAmountString } from '../../utils/bignumber'
import { currentTimestampInSeconds } from '../../utils/date'

import { useOpenOrderContext } from './open-order-context'

type LimitContractContext = {
  limit: (
    inputCurrency: Currency,
    outputCurrency: Currency,
    amount: string,
    price: string,
    postOnly: boolean,
    selectedMarket: Market,
  ) => Promise<void>
  cancels: (openOrders: OpenOrder[]) => Promise<void>
  claims: (openOrders: OpenOrder[]) => Promise<void>
}

const Context = React.createContext<LimitContractContext>({
  limit: () => Promise.resolve(),
  cancels: () => Promise.resolve(),
  claims: () => Promise.resolve(),
})

export const LimitContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()
  const { disconnectAsync } = useDisconnect()

  const { data: walletClient } = useWalletClient()
  const { openOrders } = useOpenOrderContext()
  const {
    setConfirmation,
    pendingTransactions,
    queuePendingTransaction,
    dequeuePendingTransaction,
  } = useTransactionContext()
  const { selectedChain } = useChainContext()
  const { isOpenOrderApproved, allowances, prices, balances } =
    useCurrencyContext()

  useEffect(() => {
    pendingTransactions.forEach((transaction) => {
      const openOrder = openOrders.find(
        (order) => order.txHash === transaction.txHash,
      )
      if (
        (transaction.type === 'make' || transaction.type === 'limit') &&
        openOrder
      ) {
        dequeuePendingTransaction(transaction.txHash)
      } else if (
        transaction.type === 'cancel' &&
        (!openOrder || // fulfilled
          (openOrder && Number(openOrder.cancelable) === 0)) // partially filled
      ) {
        dequeuePendingTransaction(transaction.txHash)
      } else if (
        transaction.type === 'claim' &&
        (!openOrder || // fulfilled
          (openOrder && Number(openOrder.claimable) === 0)) // partially filled
      ) {
        dequeuePendingTransaction(transaction.txHash)
      } else if (transaction.type === 'take') {
        dequeuePendingTransaction(transaction.txHash)
      }
    })
  }, [
    dequeuePendingTransaction,
    pendingTransactions,
    openOrders,
    balances, // for 'take' transaction
  ])

  const limit = useCallback(
    async (
      inputCurrency: Currency,
      outputCurrency: Currency,
      amount: string,
      price: string,
      postOnly: boolean,
      selectedMarket: Market,
    ) => {
      if (!walletClient || !selectedChain) {
        return
      }

      try {
        const isBid = isAddressEqual(
          selectedMarket.quote.address,
          inputCurrency.address,
        )
        if (
          (isBid && !selectedMarket.bidBook.isOpened) ||
          (!isBid && !selectedMarket.askBook.isOpened)
        ) {
          setConfirmation({
            title: `Checking Book Availability`,
            body: '',
            chain: selectedChain,
            fields: [],
          })
          const openTransaction = await openMarket({
            chainId: selectedChain.id,
            userAddress: walletClient.account.address,
            inputToken: inputCurrency.address,
            outputToken: outputCurrency.address,
            options: {
              rpcUrl: RPC_URL[selectedChain.id],
            },
          })
          if (openTransaction) {
            setConfirmation({
              title: `Open Book`,
              body: 'Please confirm in your wallet.',
              chain: selectedChain,
              fields: [],
            })
            await sendTransaction(
              selectedChain,
              walletClient,
              openTransaction,
              disconnectAsync,
            )
          }
        }

        setConfirmation({
          title: `Limit ${isBid ? 'Bid' : 'Ask'} @ ${price}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })

        const spender = getContractAddresses({
          chainId: selectedChain.id,
        }).Controller
        if (
          !isAddressEqual(inputCurrency.address, zeroAddress) &&
          allowances[getAddress(spender)][getAddress(inputCurrency.address)] <
            parseUnits(amount, inputCurrency.decimals)
        ) {
          setConfirmation({
            title: 'Approve',
            body: 'Please confirm in your wallet.',
            chain: selectedChain,
            fields: [],
          })
          await maxApprove(
            selectedChain,
            walletClient,
            inputCurrency,
            spender,
            disconnectAsync,
          )
        }
        const args = {
          chainId: selectedChain.id,
          userAddress: walletClient.account.address,
          inputToken: inputCurrency.address,
          outputToken: outputCurrency.address,
          amount: amount,
          price: price,
          options: {
            postOnly,
            rpcUrl: RPC_URL[selectedChain.id],
            roundingDownTakenBid: true,
            roundingDownMakeAsk: true,
          },
        }
        const { transaction, result } = await limitOrder(args)
        console.log('limitOrder request: ', args)
        console.log('limitOrder result: ', result)

        // only make order
        if (Number(result.spent.amount) === 0) {
          const confirmation = {
            title: `Limit ${isBid ? 'Bid' : 'Ask'} @ ${price}`,
            body: 'Please confirm in your wallet.',
            chain: selectedChain,
            fields: [
              {
                direction: result.make.direction,
                currency: result.make.currency,
                label: result.make.currency.symbol,
                value: toPlacesAmountString(
                  result.make.amount,
                  prices[inputCurrency.address] ?? 0,
                ),
              },
            ] as Confirmation['fields'],
          }
          setConfirmation(confirmation)

          const hash = await sendTransaction(
            selectedChain,
            walletClient,
            transaction,
            disconnectAsync,
          )
          if (hash) {
            queuePendingTransaction({
              ...confirmation,
              txHash: hash,
              type: 'make',
              timestamp: currentTimestampInSeconds(),
            })
          }
        }
        // limit order or take order
        else {
          const confirmation = {
            title: `Limit ${isBid ? 'Bid' : 'Ask'} @ ${price}`,
            body: 'Please confirm in your wallet.',
            chain: selectedChain,
            fields: [
              {
                direction: result.make.direction,
                currency: result.make.currency,
                label: result.make.currency.symbol,
                value: toPlacesAmountString(
                  Number(result.make.amount) + Number(result.spent.amount),
                  prices[inputCurrency.address] ?? 0,
                ),
              },
              {
                direction: result.taken.direction,
                currency: result.taken.currency,
                label: result.taken.currency.symbol,
                value: toPlacesAmountString(
                  result.taken.amount,
                  prices[outputCurrency.address] ?? 0,
                ),
              },
            ] as Confirmation['fields'],
          }
          setConfirmation(confirmation)

          const hash = await sendTransaction(
            selectedChain,
            walletClient,
            transaction,
            disconnectAsync,
          )
          if (hash) {
            const makeRatio =
              (Number(result.make.amount) * 100) / Number(amount)
            // dev: make.amount is not exact zero
            if (makeRatio < 0.01) {
              queuePendingTransaction({
                ...confirmation,
                txHash: hash,
                type: 'take',
                timestamp: currentTimestampInSeconds(),
              })
            } else {
              queuePendingTransaction({
                ...confirmation,
                txHash: hash,
                type: 'limit',
                timestamp: currentTimestampInSeconds(),
              })
            }
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({ queryKey: ['open-orders'] }),
          queryClient.invalidateQueries({ queryKey: ['market'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      allowances,
      disconnectAsync,
      prices,
      queryClient,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const cancels = useCallback(
    async (openOrders: OpenOrder[]) => {
      if (!walletClient || !selectedChain) {
        return
      }

      try {
        setConfirmation({
          title: `Cancel Order`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })
        if (!isOpenOrderApproved) {
          const hash = await setApprovalOfOpenOrdersForAll({
            chainId: walletClient.chain.id,
            walletClient: walletClient as any,
            options: {
              rpcUrl: RPC_URL[walletClient.chain.id],
            },
          })
          if (hash) {
            await waitTransaction(walletClient.chain.id, hash)
          }
        }

        const { transaction, result } = await cancelOrders({
          chainId: selectedChain.id,
          userAddress: walletClient.account.address,
          ids: openOrders.map((order) => String(order.id)),
          options: {
            rpcUrl: RPC_URL[selectedChain.id],
          },
        })

        const confirmation = {
          title: `Cancel Order`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: result.map(({ currency, amount, direction }) => ({
            currency,
            label: currency.symbol,
            value: toPlacesAmountString(amount, prices[currency.address] ?? 0),
            direction,
          })),
        }
        setConfirmation(confirmation)
        const hash = await sendTransaction(
          selectedChain,
          walletClient,
          transaction,
          disconnectAsync,
        )
        if (hash) {
          queuePendingTransaction({
            ...confirmation,
            txHash: hash,
            type: 'cancel',
            timestamp: currentTimestampInSeconds(),
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({ queryKey: ['open-orders'] }),
          queryClient.invalidateQueries({ queryKey: ['market'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      isOpenOrderApproved,
      prices,
      queryClient,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const claims = useCallback(
    async (openOrders: OpenOrder[]) => {
      if (!walletClient || !selectedChain) {
        return
      }

      try {
        setConfirmation({
          title: `Claim Order`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })
        if (!isOpenOrderApproved) {
          const hash = await setApprovalOfOpenOrdersForAll({
            chainId: walletClient.chain.id,
            walletClient: walletClient as any,
            options: {
              rpcUrl: RPC_URL[walletClient.chain.id],
            },
          })
          if (hash) {
            await waitTransaction(walletClient.chain.id, hash)
          }
        }

        const { transaction, result } = await claimOrders({
          chainId: selectedChain.id,
          userAddress: walletClient.account.address,
          ids: openOrders.map((order) => String(order.id)),
          options: {
            rpcUrl: RPC_URL[selectedChain.id],
          },
        })

        const confirmation = {
          title: `Claim Order`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: result.map(({ currency, amount, direction }) => ({
            currency,
            label: currency.symbol,
            value: toPlacesAmountString(amount, prices[currency.address] ?? 0),
            direction,
          })),
        }
        setConfirmation(confirmation)
        const hash = await sendTransaction(
          selectedChain,
          walletClient,
          transaction,
          disconnectAsync,
        )
        if (hash) {
          queuePendingTransaction({
            ...confirmation,
            txHash: hash,
            type: 'claim',
            timestamp: currentTimestampInSeconds(),
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({ queryKey: ['open-orders'] }),
          queryClient.invalidateQueries({ queryKey: ['market'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      isOpenOrderApproved,
      prices,
      queryClient,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  return (
    <Context.Provider value={{ limit, cancels, claims }}>
      {children}
    </Context.Provider>
  )
}

export const useLimitContractContext = () =>
  React.useContext(Context) as LimitContractContext
