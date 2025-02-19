import { createPublicClient, Hash, http, WalletClient } from 'viem'
import { CHAIN_IDS, Transaction } from '@clober/v2-sdk'

import { supportChains } from '../constants/chain'
import { RPC_URL } from '../constants/rpc-urls'

export async function sendTransaction(
  walletClient: WalletClient,
  transaction: Transaction,
): Promise<Hash | undefined> {
  if (!walletClient) {
    return
  }
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === walletClient.chain!.id),
    transport: http(RPC_URL[walletClient.chain!.id]),
  })
  const hash = await walletClient.sendTransaction({
    data: transaction.data,
    to: transaction.to,
    value: transaction.value,
    gas: transaction.gas,
    account: walletClient.account!,
    chain: walletClient.chain!,
  })
  await publicClient.waitForTransactionReceipt({ hash })
  return hash
}

export async function waitTransaction(
  chainId: CHAIN_IDS,
  hash: Hash,
): Promise<void> {
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === chainId),
    transport: http(RPC_URL[chainId]),
  })
  await publicClient.waitForTransactionReceipt({ hash })
}
