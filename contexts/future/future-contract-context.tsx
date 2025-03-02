import React, { useCallback } from 'react'
import { useWalletClient } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import {
  Hash,
  getAddress,
  isAddressEqual,
  zeroAddress,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  BaseError,
  ContractFunctionRevertedError,
} from 'viem'
import { getPublicClient } from '@wagmi/core'
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'

import { Asset } from '../../model/future/asset'
import { useCurrencyContext } from '../currency-context'
import { useTransactionContext } from '../transaction-context'
import { WETH } from '../../constants/currency'
import { maxApprove } from '../../utils/approve20'
import { CONTRACT_ADDRESSES } from '../../constants/future/contracts'
import { useChainContext } from '../chain-context'
import { formatUnits } from '../../utils/bigint'
import { VAULT_MANAGER_ABI } from '../../abis/future/vault-manager.json-abi'
import { wagmiConfig } from '../../constants/chain'
import { PYTH_ABI } from '../../abis/future/pyth-abi'
import { UserPosition } from '../../model/future/user-position'

type FutureContractContext = {
  isMarketClose: (asset: Asset, debtAmount: bigint) => Promise<boolean>
  borrow: (
    asset: Asset,
    collateralAmount: bigint,
    debtAmount: bigint,
  ) => Promise<Hash | undefined>
  repay: (asset: Asset, debtAmount: bigint) => Promise<Hash | undefined>
  repayAll: (position: UserPosition) => Promise<Hash | undefined>
}

const Context = React.createContext<FutureContractContext>({
  borrow: () => Promise.resolve(undefined),
  isMarketClose: () => Promise.resolve(false),
  repay: () => Promise.resolve(undefined),
  repayAll: () => Promise.resolve(undefined),
})

export const FutureContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()

  const publicClient = getPublicClient(wagmiConfig)
  const { data: walletClient } = useWalletClient()
  const { setConfirmation } = useTransactionContext()
  const { selectedChain } = useChainContext()
  const { allowances, prices } = useCurrencyContext()

  const isMarketClose = useCallback(
    async (asset: Asset, debtAmount: bigint): Promise<boolean> => {
      try {
        if (!walletClient) {
          throw new Error('Wallet not connected')
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
          address: CONTRACT_ADDRESSES[selectedChain.id].Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        await publicClient.simulateContract({
          chain: walletClient.chain,
          address: CONTRACT_ADDRESSES[selectedChain.id].VaultManager,
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
        return true
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

      let hash: Hash | undefined
      try {
        setConfirmation({
          title: `Short ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })

        const spender = CONTRACT_ADDRESSES[selectedChain.id].VaultManager
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
            fields: [],
          })
          await maxApprove(walletClient, asset.collateral, spender)
        }

        setConfirmation({
          title: `Short ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
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
        })

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
          address: CONTRACT_ADDRESSES[selectedChain.id].Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        hash = await walletClient.writeContract({
          chain: walletClient.chain,
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
        })
        if (hash) {
          await publicClient.waitForTransactionReceipt({
            hash,
          })
        }
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
      return hash
    },
    [
      allowances,
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
      setConfirmation,
      walletClient,
    ],
  )

  const repay = useCallback(
    async (asset: Asset, debtAmount: bigint): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      let hash: Hash | undefined
      try {
        setConfirmation({
          title: `Repay ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })

        setConfirmation({
          title: `Repay ${asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
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
          ],
        })

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
          address: CONTRACT_ADDRESSES[selectedChain.id].Pyth,
          abi: PYTH_ABI,
          functionName: 'getUpdateFee',
          args: [priceFeedUpdateData as any],
        })

        hash = await walletClient.writeContract({
          chain: walletClient.chain,
          address: CONTRACT_ADDRESSES[selectedChain.id].VaultManager,
          functionName: 'multicall',
          abi: VAULT_MANAGER_ABI,
          value: fee,
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
        })
        if (hash) {
          await publicClient.waitForTransactionReceipt({
            hash,
          })
        }
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
      return hash
    },
    [
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
      setConfirmation,
      walletClient,
    ],
  )

  const repayAll = useCallback(
    async (userPosition: UserPosition): Promise<Hash | undefined> => {
      if (!walletClient) {
        return
      }

      let hash: Hash | undefined
      try {
        setConfirmation({
          title: `Close ${userPosition.asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })

        setConfirmation({
          title: `Close ${userPosition.asset.currency.symbol}`,
          body: 'Please confirm in your wallet.',
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
          ],
        })

        hash = await walletClient.writeContract({
          chain: walletClient.chain,
          address: CONTRACT_ADDRESSES[selectedChain.id].VaultManager,
          functionName: 'multicall',
          abi: VAULT_MANAGER_ABI,
          args: [
            [
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
        })
        if (hash) {
          await publicClient.waitForTransactionReceipt({
            hash,
          })
        }
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
      return hash
    },
    [
      prices,
      publicClient,
      queryClient,
      selectedChain.id,
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
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useFutureContractContext = () =>
  React.useContext(Context) as FutureContractContext
