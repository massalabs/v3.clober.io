import {
  createPublicClient,
  Hash,
  http,
  TransactionReceipt,
  WalletClient,
} from 'viem'
import { Transaction } from '@clober/v2-sdk'

import { RPC_URL } from '../constants/rpc-url'
import { Chain } from '../model/chain'

export async function sendTransaction(
  chain: Chain,
  walletClient: WalletClient,
  transaction: Transaction,
  disconnectAsync: () => Promise<void>,
): Promise<TransactionReceipt | undefined> {
  if (!walletClient) {
    return
  }
  if (disconnectAsync && chain.id !== walletClient.chain!.id) {
    await disconnectAsync()
  }
  try {
    const publicClient = createPublicClient({
      chain,
      transport: http(RPC_URL[chain.id]),
    })
    const hash = await walletClient.sendTransaction({
      data: transaction.data,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas,
      account: walletClient.account!,
      chain,
    })
    return publicClient.waitForTransactionReceipt({ hash })
  } catch (e) {
    console.error('Failed to send transaction', e)
    throw e
  }
}

export async function waitTransaction(chain: Chain, hash: Hash): Promise<void> {
  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_URL[chain.id]),
  })
  await publicClient.waitForTransactionReceipt({ hash })
}
