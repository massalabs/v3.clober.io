import React, { useCallback, useEffect } from 'react'
import { getAddress, isAddressEqual, zeroAddress } from 'viem'
import { useDisconnect, useWalletClient } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import {
  getContractAddresses,
  Market,
  marketOrder,
  Transaction,
} from '@clober/v2-sdk'

import { Currency } from '../../model/currency'
import { formatUnits } from '../../utils/bigint'
import { fetchSwapData } from '../../apis/swap/data'
import { Confirmation, useTransactionContext } from '../transaction-context'
import { sendTransaction } from '../../utils/transaction'
import { useCurrencyContext } from '../currency-context'
import { maxApprove } from '../../utils/approve20'
import { Aggregator } from '../../model/aggregator'
import { WETH } from '../../constants/currency'
import { useChainContext } from '../chain-context'
import { RPC_URL } from '../../constants/rpc-urls'
import { currentTimestampInSeconds } from '../../utils/date'

type SwapContractContext = {
  swap: (
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    expectedAmountOut: bigint,
    slippageLimitPercent: number,
    gasPrice: bigint,
    userAddress: `0x${string}`,
    aggregator: Aggregator,
  ) => Promise<void>
  market: (
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    slippageLimitPercent: number,
    userAddress: `0x${string}`,
    selectedMarket: Market,
  ) => Promise<void>
}

const Context = React.createContext<SwapContractContext>({
  swap: () => Promise.resolve(),
  market: () => Promise.resolve(),
})

export const SwapContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()
  const { disconnectAsync } = useDisconnect()

  const { data: walletClient } = useWalletClient()
  const {
    setConfirmation,
    pendingTransactions,
    queuePendingTransaction,
    dequeuePendingTransaction,
  } = useTransactionContext()
  const { selectedChain } = useChainContext()
  const { allowances, prices, balances } = useCurrencyContext()

  useEffect(() => {
    pendingTransactions.forEach((transaction) => {
      if (!transaction.success) {
        dequeuePendingTransaction(transaction.txHash)
        return
      }
      if (transaction.type === 'swap' || transaction.type === 'market') {
        dequeuePendingTransaction(transaction.txHash)
      }
    })
  }, [
    dequeuePendingTransaction,
    pendingTransactions,
    balances, // for 'swap' type or 'market' type
  ])

  const swap = useCallback(
    async (
      inputCurrency: Currency,
      amountIn: bigint,
      outputCurrency: Currency,
      expectedAmountOut: bigint,
      slippageLimitPercent: number,
      gasPrice: bigint,
      userAddress: `0x${string}`,
      aggregator: Aggregator,
    ) => {
      if (!walletClient) {
        return
      }

      try {
        setConfirmation({
          title: 'Swap',
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })

        const swapData = await fetchSwapData(
          aggregator,
          inputCurrency,
          amountIn,
          outputCurrency,
          slippageLimitPercent,
          gasPrice,
          userAddress,
        )

        const spender = getAddress(swapData.transaction.to)
        if (
          !isAddressEqual(spender, WETH[selectedChain.id].address) &&
          !isAddressEqual(inputCurrency.address, zeroAddress) &&
          allowances[getAddress(spender)][getAddress(inputCurrency.address)] <
            amountIn
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

        const confirmation = {
          title: 'Swap',
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: inputCurrency,
              label: inputCurrency.symbol,
              direction: 'in',
              value: formatUnits(
                amountIn,
                inputCurrency.decimals,
                prices[inputCurrency.address] ?? 0,
              ),
            },
            {
              currency: outputCurrency,
              label: outputCurrency.symbol,
              direction: 'out',
              value: formatUnits(
                expectedAmountOut,
                outputCurrency.decimals,
                prices[outputCurrency.address] ?? 0,
              ),
            },
          ] as Confirmation['fields'],
        }
        setConfirmation(confirmation)
        const transactionReceipt = await sendTransaction(
          selectedChain,
          walletClient,
          swapData.transaction as Transaction,
          disconnectAsync,
        )
        if (transactionReceipt) {
          queuePendingTransaction({
            ...confirmation,
            txHash: transactionReceipt.transactionHash,
            success: transactionReceipt.status === 'success',
            blockNumber: Number(transactionReceipt.blockNumber),
            type: 'swap',
            timestamp: currentTimestampInSeconds(),
          })
        }
      } catch (e) {
        await queryClient.invalidateQueries({ queryKey: ['quotes'] })
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      walletClient,
      setConfirmation,
      selectedChain,
      allowances,
      prices,
      disconnectAsync,
      queuePendingTransaction,
      queryClient,
    ],
  )

  const market = useCallback(
    async (
      inputCurrency: Currency,
      amountIn: bigint,
      outputCurrency: Currency,
      slippageLimitPercent: number,
      userAddress: `0x${string}`,
    ) => {
      if (!walletClient) {
        return
      }

      try {
        setConfirmation({
          title: 'Swap',
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })

        const spender = getContractAddresses({
          chainId: selectedChain.id,
        }).Controller
        if (
          !isAddressEqual(spender, WETH[selectedChain.id].address) &&
          !isAddressEqual(inputCurrency.address, zeroAddress) &&
          allowances[getAddress(spender)][getAddress(inputCurrency.address)] <
            amountIn
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

        const { transaction, result } = await marketOrder({
          chainId: selectedChain.id,
          userAddress,
          inputToken: inputCurrency.address,
          outputToken: outputCurrency.address,
          amountIn: formatUnits(amountIn, inputCurrency.decimals),
          options: {
            rpcUrl: RPC_URL[selectedChain.id],
            slippage: slippageLimitPercent,
          },
        })

        const confirmation = {
          title: 'Swap',
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: inputCurrency,
              label: inputCurrency.symbol,
              direction: 'in',
              value: formatUnits(
                amountIn,
                inputCurrency.decimals,
                prices[inputCurrency.address] ?? 0,
              ),
            },
            {
              currency: outputCurrency,
              label: outputCurrency.symbol,
              direction: 'out',
              value: result.taken.amount,
            },
          ] as Confirmation['fields'],
        }
        setConfirmation(confirmation)
        const transactionReceipt = await sendTransaction(
          selectedChain,
          walletClient,
          transaction,
          disconnectAsync,
        )
        if (transactionReceipt) {
          queuePendingTransaction({
            ...confirmation,
            txHash: transactionReceipt.transactionHash,
            success: transactionReceipt.status === 'success',
            blockNumber: Number(transactionReceipt.blockNumber),
            type: 'market',
            timestamp: currentTimestampInSeconds(),
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      walletClient,
      setConfirmation,
      selectedChain,
      allowances,
      prices,
      disconnectAsync,
      queuePendingTransaction,
      queryClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        swap,
        market,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useSwapContractContext = () =>
  React.useContext(Context) as SwapContractContext
