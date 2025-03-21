import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDisconnect, useWalletClient } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import {
  BaseError,
  ContractFunctionRevertedError,
  createPublicClient,
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  Hash,
  http,
  isAddressEqual,
  parseAbiParameters,
  zeroAddress,
} from 'viem'
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'

import { Asset } from '../../model/future/asset'
import { useCurrencyContext } from '../currency-context'
import { Confirmation, useTransactionContext } from '../transaction-context'
import { WETH } from '../../constants/currency'
import { maxApprove } from '../../utils/approve20'
import { CONTRACT_ADDRESSES } from '../../constants/future/contracts'
import { useChainContext } from '../chain-context'
import { formatUnits } from '../../utils/bigint'
import { VAULT_MANAGER_ABI } from '../../abis/future/vault-manager.json-abi'
import { supportChains } from '../../constants/chain'
import { PYTH_ABI } from '../../abis/future/pyth-abi'
import { UserPosition } from '../../model/future/user-position'
import { buildTransaction } from '../../utils/build-transaction'
import { sendTransaction } from '../../utils/transaction'
import { RPC_URL } from '../../constants/rpc-urls'
import { currentTimestampInSeconds } from '../../utils/date'

import { useFutureContext } from './future-context'

type FutureContractContext = {
  isMarketClose: (asset: Asset, debtAmount: bigint) => Promise<boolean>
  borrow: (
    asset: Asset,
    collateralAmount: bigint,
    debtAmount: bigint,
  ) => Promise<Hash | undefined>
  repay: (asset: Asset, debtAmount: bigint) => Promise<Hash | undefined>
  repayAll: (position: UserPosition) => Promise<Hash | undefined>
  settle: (asset: Asset) => Promise<Hash | undefined>
  close: (asset: Asset, collateralReceived: bigint) => Promise<Hash | undefined>
  redeem: (
    asset: Asset,
    amount: bigint,
    collateralReceived: bigint,
  ) => Promise<Hash | undefined>
}

const Context = React.createContext<FutureContractContext>({
  borrow: () => Promise.resolve(undefined),
  isMarketClose: () => Promise.resolve(false),
  repay: () => Promise.resolve(undefined),
  repayAll: () => Promise.resolve(undefined),
  settle: () => Promise.resolve(undefined),
  close: () => Promise.resolve(undefined),
  redeem: () => Promise.resolve(undefined),
})

export const FutureContractProvider = ({
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
  const {
    positions,
    queuePendingPositionCurrencyAddress,
    dequeuePendingPositionCurrencyAddress,
  } = useFutureContext()
  const { selectedChain } = useChainContext()
  const { allowances, prices, balances } = useCurrencyContext()
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: supportChains.find((chain) => chain.id === selectedChain.id),
      transport: http(RPC_URL[selectedChain.id]),
    })
  }, [selectedChain.id])
  const previousPositions = useRef({
    positions: [] as UserPosition[],
  })

  useEffect(() => {
    pendingTransactions.forEach((transaction) => {
      if (!transaction.success) {
        dequeuePendingTransaction(transaction.txHash)
        return
      }

      const [userDecreasedCurrency, userIncreasedCurrency] = [
        transaction.fields.find((field) => field.direction === 'in')?.currency,
        transaction.fields.find((field) => field.direction === 'out')?.currency,
      ]

      const now = currentTimestampInSeconds()
      if (transaction.type === 'borrow' && userIncreasedCurrency) {
        const debtCurrency = userIncreasedCurrency
        const previousPosition = previousPositions.current.positions.find(
          (position) =>
            isAddressEqual(
              position.asset.currency.address,
              debtCurrency.address,
            ),
        )
        const currentPosition = positions.find((position) => {
          return isAddressEqual(
            position.asset.currency.address,
            debtCurrency.address,
          )
        })
        if (
          (currentPosition?.debtAmount ?? 0n) >
          (previousPosition?.debtAmount ?? 0n)
        ) {
          // borrow success
          dequeuePendingTransaction(transaction.txHash)
          dequeuePendingPositionCurrencyAddress(
            currentPosition?.asset.currency.address,
          )
        }
      } else if (
        (transaction.type === 'repay' || transaction.type === 'repay-all') &&
        userDecreasedCurrency
      ) {
        const debtCurrency = userDecreasedCurrency
        const previousPosition = previousPositions.current.positions.find(
          (position) =>
            isAddressEqual(
              position.asset.currency.address,
              debtCurrency.address,
            ),
        )
        const currentPosition = positions.find((position) => {
          return isAddressEqual(
            position.asset.currency.address,
            debtCurrency.address,
          )
        })
        if (
          (currentPosition?.debtAmount ?? 0n) <
          (previousPosition?.debtAmount ?? 0n)
        ) {
          // repay success
          dequeuePendingTransaction(transaction.txHash)
          dequeuePendingPositionCurrencyAddress(
            currentPosition?.asset.currency.address,
          )
        }
      } else if (
        transaction.type === 'settle' &&
        previousPositions.current.positions
          .map((position) => position.asset.settlePrice)
          .sort() !==
          positions.map((position) => position.asset.settlePrice).sort()
      ) {
        // settle success
        dequeuePendingTransaction(transaction.txHash)

        for (let i = 0; i < positions.length; i++) {
          for (let j = 0; j < previousPositions.current.positions.length; j++) {
            if (
              isAddressEqual(
                positions[i].asset.currency.address,
                previousPositions.current.positions[j].asset.currency.address,
              ) &&
              positions[i].asset.settlePrice === 0 &&
              previousPositions.current.positions[j].asset.settlePrice !== 0
            ) {
              dequeuePendingPositionCurrencyAddress(
                positions[i].asset.currency.address,
              )
            }
          }
        }
      } else if (
        transaction.type === 'close' &&
        previousPositions.current.positions.filter(
          (position) => position.asset.expiration > now,
        ).length ===
          positions.filter((position) => position.asset.expiration > now)
            .length +
            1
      ) {
        // close success
        dequeuePendingTransaction(transaction.txHash)
        dequeuePendingPositionCurrencyAddress(
          previousPositions.current.positions
            .filter((position) => position.asset.expiration > now)
            .find(
              (position) =>
                !positions
                  .filter((position) => position.asset.expiration > now)
                  .some((currentPosition) =>
                    isAddressEqual(
                      currentPosition.asset.currency.address,
                      position.asset.currency.address,
                    ),
                  ),
            )?.asset.currency.address,
        )
      } else if (transaction.type === 'redeem') {
        // redeem success
        dequeuePendingTransaction(transaction.txHash)
      }
    })
  }, [
    dequeuePendingTransaction,
    pendingTransactions,
    positions,
    balances,
    dequeuePendingPositionCurrencyAddress,
  ])

  const isMarketClose = useCallback(
    async (asset: Asset, debtAmount: bigint): Promise<boolean> => {
      try {
        if (!walletClient) {
          throw new Error('Wallet not connected')
        }
        if (CONTRACT_ADDRESSES[selectedChain.id] === undefined) {
          throw new Error('Contract address not found')
        }

        const evmPriceServiceConnection = new EvmPriceServiceConnection(
          'https://hermes.pyth.network',
        )
        const priceFeedUpdateData =
          await evmPriceServiceConnection.getPriceFeedsUpdateData([
            asset.currency.priceFeedId,
            asset.collateral.priceFeedId,
          ])

        const fee = await publicClient.readContract({
          address: CONTRACT_ADDRESSES[selectedChain.id]!.Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        await publicClient.simulateContract({
          chain: walletClient.chain,
          address: CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager,
          functionName: 'multicall',
          abi: VAULT_MANAGER_ABI,
          value: fee,
          args: [
            [
              encodeFunctionData({
                abi: VAULT_MANAGER_ABI,
                functionName: 'updateOracle',
                args: [
                  encodeAbiParameters(parseAbiParameters('bytes[]'), [
                    priceFeedUpdateData as any,
                  ]),
                ],
              }),
              encodeFunctionData({
                abi: VAULT_MANAGER_ABI,
                functionName: 'mint',
                args: [
                  asset.currency.address,
                  walletClient.account.address,
                  debtAmount,
                ],
              }),
            ],
          ],
        })
        return false
      } catch (e) {
        if (e instanceof BaseError) {
          const revertError = e.walk(
            (err) => err instanceof ContractFunctionRevertedError,
          )
          if (revertError instanceof ContractFunctionRevertedError) {
            if (revertError.toString().includes('0x19abf40e')) {
              return true
            }
          }
        }
        return false
      }
    },
    [publicClient, selectedChain.id, walletClient],
  )

  const borrow = useCallback(
    async (
      asset: Asset,
      collateralAmount: bigint,
      debtAmount: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      try {
        setConfirmation({
          title: `Short ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })

        const spender = CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager
        if (
          !isAddressEqual(spender, WETH[selectedChain.id].address) &&
          !isAddressEqual(asset.collateral.address, zeroAddress) &&
          allowances[getAddress(spender)][
            getAddress(asset.collateral.address)
          ] < collateralAmount
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
            asset.collateral,
            spender,
            disconnectAsync,
          )
        }

        const confirmation = {
          title: `Short ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: asset.collateral,
              label: asset.collateral.symbol,
              direction: 'in',
              value: formatUnits(
                collateralAmount,
                asset.collateral.decimals,
                prices[asset.collateral.address] ?? 0,
              ),
            },
            {
              currency: asset.currency,
              label: asset.currency.symbol,
              direction: 'out',
              value: formatUnits(
                debtAmount,
                asset.currency.decimals,
                prices[asset.currency.address] ?? 0,
              ),
            },
          ].filter((field) => field.value !== '0') as any[],
        }
        setConfirmation(confirmation)
        previousPositions.current.positions = positions

        const evmPriceServiceConnection = new EvmPriceServiceConnection(
          'https://hermes.pyth.network',
        )
        const priceFeedUpdateData =
          await evmPriceServiceConnection.getPriceFeedsUpdateData([
            asset.currency.priceFeedId,
            asset.collateral.priceFeedId,
          ])

        if (priceFeedUpdateData.length === 0) {
          console.error('Price feed not found')
          return
        }

        const fee = await publicClient.readContract({
          address: CONTRACT_ADDRESSES[selectedChain.id]!.Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        const transaction = await buildTransaction(
          publicClient,
          {
            chain: selectedChain,
            address: spender,
            functionName: 'multicall',
            abi: VAULT_MANAGER_ABI,
            value: fee,
            args: [
              [
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'updateOracle',
                  args: [
                    encodeAbiParameters(parseAbiParameters('bytes[]'), [
                      priceFeedUpdateData as any,
                    ]),
                  ],
                }),
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'deposit',
                  args: [
                    asset.currency.address,
                    walletClient.account.address,
                    collateralAmount,
                  ],
                }),
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'mint',
                  args: [
                    asset.currency.address,
                    walletClient.account.address,
                    debtAmount,
                  ],
                }),
              ],
            ],
          },
          5_000_000n,
        )
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
            type: 'borrow',
            timestamp: currentTimestampInSeconds(),
          })
          queuePendingPositionCurrencyAddress(asset.currency.address)
        }
        return transactionReceipt?.transactionHash
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['future-positions'] }),
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      allowances,
      disconnectAsync,
      positions,
      prices,
      publicClient,
      queryClient,
      queuePendingPositionCurrencyAddress,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const repay = useCallback(
    async (asset: Asset, debtAmount: bigint): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      try {
        setConfirmation({
          title: `Repay ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })

        const confirmation = {
          title: `Repay ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: asset.currency,
              label: asset.currency.symbol,
              direction: 'in',
              value: formatUnits(
                debtAmount,
                asset.currency.decimals,
                prices[asset.currency.address] ?? 0,
              ),
            },
          ] as Confirmation['fields'],
        }
        setConfirmation(confirmation)
        previousPositions.current.positions = positions

        const transaction = await buildTransaction(
          publicClient,
          {
            chain: selectedChain,
            address: CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager,
            functionName: 'multicall',
            abi: VAULT_MANAGER_ABI,
            args: [
              [
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'burn',
                  args: [
                    asset.currency.address,
                    walletClient.account.address,
                    debtAmount,
                  ],
                }),
              ],
            ],
          },
          5_000_000n,
        )
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
            type: 'repay',
            timestamp: currentTimestampInSeconds(),
          })
          queuePendingPositionCurrencyAddress(asset.currency.address)
        }
        return transactionReceipt?.transactionHash
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['future-positions'] }),
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      positions,
      prices,
      publicClient,
      queryClient,
      queuePendingPositionCurrencyAddress,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const repayAll = useCallback(
    async (userPosition: UserPosition): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      try {
        setConfirmation({
          title: `Close ${userPosition.asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        })

        const confirmation = {
          title: `Close ${userPosition.asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: userPosition.asset.currency,
              label: userPosition.asset.currency.symbol,
              direction: 'in',
              value: formatUnits(
                userPosition?.debtAmount ?? 0n,
                userPosition.asset.currency.decimals,
                prices[userPosition.asset.currency.address] ?? 0,
              ),
            },
            {
              currency: userPosition.asset.collateral,
              label: userPosition.asset.collateral.symbol,
              direction: 'out',
              value: formatUnits(
                userPosition?.collateralAmount ?? 0n,
                userPosition.asset.collateral.decimals,
                prices[userPosition.asset.collateral.address] ?? 0,
              ),
            },
          ] as Confirmation['fields'],
        }
        setConfirmation(confirmation)
        previousPositions.current.positions = positions

        const evmPriceServiceConnection = new EvmPriceServiceConnection(
          'https://hermes.pyth.network',
        )
        const priceFeedUpdateData =
          await evmPriceServiceConnection.getPriceFeedsUpdateData([
            userPosition.asset.currency.priceFeedId,
            userPosition.asset.collateral.priceFeedId,
          ])

        if (priceFeedUpdateData.length === 0) {
          console.error('Price feed not found')
          return
        }

        const fee = await publicClient.readContract({
          address: CONTRACT_ADDRESSES[selectedChain.id]!.Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        const transaction = await buildTransaction(
          publicClient,
          {
            chain: selectedChain,
            address: CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager,
            functionName: 'multicall',
            abi: VAULT_MANAGER_ABI,
            value: fee,
            args: [
              [
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'updateOracle',
                  args: [
                    encodeAbiParameters(parseAbiParameters('bytes[]'), [
                      priceFeedUpdateData as any,
                    ]),
                  ],
                }),
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'burn',
                  args: [
                    userPosition.asset.currency.address,
                    walletClient.account.address,
                    userPosition?.debtAmount ?? 0n,
                  ],
                }),
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'withdraw',
                  args: [
                    userPosition.asset.currency.address,
                    walletClient.account.address,
                    userPosition?.collateralAmount ?? 0n,
                  ],
                }),
              ],
            ],
          },
          5_000_000n,
        )
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
            type: 'repay-all',
            timestamp: currentTimestampInSeconds(),
          })
          queuePendingPositionCurrencyAddress(
            userPosition.asset.currency.address,
          )
        }
        return transactionReceipt?.transactionHash
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['future-positions'] }),
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      positions,
      prices,
      publicClient,
      queryClient,
      queuePendingPositionCurrencyAddress,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const settle = useCallback(
    async (asset: Asset): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      try {
        const confirmation = {
          title: `Settle ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [],
        }
        setConfirmation(confirmation)
        previousPositions.current.positions = positions

        const evmPriceServiceConnection = new EvmPriceServiceConnection(
          'https://hermes.pyth.network',
        )
        const priceFeedUpdateData =
          await evmPriceServiceConnection.getPriceFeedsUpdateData([
            asset.currency.priceFeedId,
            asset.collateral.priceFeedId,
          ])

        if (priceFeedUpdateData.length === 0) {
          console.error('Price feed not found')
          return
        }

        const fee = await publicClient.readContract({
          address: CONTRACT_ADDRESSES[selectedChain.id]!.Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        const transaction = await buildTransaction(
          publicClient,
          {
            chain: selectedChain,
            address: CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager,
            functionName: 'multicall',
            abi: VAULT_MANAGER_ABI,
            value: fee,
            args: [
              [
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'updateOracle',
                  args: [
                    encodeAbiParameters(parseAbiParameters('bytes[]'), [
                      priceFeedUpdateData as any,
                    ]),
                  ],
                }),
                encodeFunctionData({
                  abi: VAULT_MANAGER_ABI,
                  functionName: 'settle',
                  args: [asset.currency.address],
                }),
              ],
            ],
          },
          5_000_000n,
        )
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
            type: 'settle',
            timestamp: currentTimestampInSeconds(),
          })
          queuePendingPositionCurrencyAddress(asset.currency.address)
        }
        return transactionReceipt?.transactionHash
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['future-assets'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      positions,
      publicClient,
      queryClient,
      queuePendingPositionCurrencyAddress,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const close = useCallback(
    async (
      asset: Asset,
      collateralReceived: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      try {
        const confirmation = {
          title: `Close`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: asset.collateral,
              label: asset.collateral.symbol,
              direction: 'out',
              value: formatUnits(
                collateralReceived,
                asset.collateral.decimals,
                prices[asset.collateral.address] ?? 0,
              ),
            },
          ] as Confirmation['fields'],
        }
        setConfirmation(confirmation)
        previousPositions.current.positions = positions

        const transaction = await buildTransaction(
          publicClient,
          {
            chain: selectedChain,
            address: CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager,
            functionName: 'close',
            abi: VAULT_MANAGER_ABI,
            args: [asset.currency.address, walletClient.account.address],
          },
          5_000_000n,
        )
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
            type: 'close',
            timestamp: currentTimestampInSeconds(),
          })
          queuePendingPositionCurrencyAddress(asset.currency.address)
        }
        return transactionReceipt?.transactionHash
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['future-positions'] }),
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      positions,
      prices,
      publicClient,
      queryClient,
      queuePendingPositionCurrencyAddress,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  const redeem = useCallback(
    async (
      asset: Asset,
      amount: bigint,
      collateralReceived: bigint,
    ): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      try {
        const confirmation = {
          title: `Redeem`,
          body: 'Please confirm in your wallet.',
          chain: selectedChain,
          fields: [
            {
              currency: asset.currency,
              label: asset.currency.symbol,
              direction: 'in',
              value: formatUnits(
                amount,
                asset.currency.decimals,
                prices[asset.currency.address] ?? 0,
              ),
            },
            {
              currency: asset.collateral,
              label: asset.collateral.symbol,
              direction: 'out',
              value: formatUnits(
                collateralReceived,
                asset.collateral.decimals,
                prices[asset.collateral.address] ?? 0,
              ),
            },
          ] as Confirmation['fields'],
        }
        setConfirmation(confirmation)
        previousPositions.current.positions = positions

        const transaction = await buildTransaction(
          publicClient,
          {
            chain: selectedChain,
            address: CONTRACT_ADDRESSES[selectedChain.id]!.VaultManager,
            functionName: 'redeem',
            abi: VAULT_MANAGER_ABI,
            args: [
              asset.currency.address,
              walletClient.account.address,
              amount,
            ],
          },
          1_000_000n,
        )
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
            type: 'redeem',
            timestamp: currentTimestampInSeconds(),
          })
        }
        return transactionReceipt?.transactionHash
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['future-positions'] }),
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      disconnectAsync,
      positions,
      prices,
      publicClient,
      queryClient,
      queuePendingTransaction,
      selectedChain,
      setConfirmation,
      walletClient,
    ],
  )

  return (
    <Context.Provider
      value={{
        isMarketClose,
        borrow,
        repay,
        repayAll,
        settle,
        close,
        redeem,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useFutureContractContext = () =>
  React.useContext(Context) as FutureContractContext
