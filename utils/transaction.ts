import { createPublicClient, Hash, http, WalletClient } from 'viem'
import { CHAIN_IDS, Transaction } from '@clober/v2-sdk'

import { supportChains } from '../constants/chain'
import { RPC_URL } from '../constants/rpc-urls'
import { Chain } from '../model/chain'

const refreshWallet = async () => {
  try {
    const provider = window.ethereum
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' })
      window.location.reload()
    }
  } catch (e) {
    console.error('Failed to switch chain', e)
  }
}

export async function sendTransaction(
  chain: Chain,
  walletClient: WalletClient,
  transaction: Transaction,
): Promise<Hash | undefined> {
  if (!walletClient) {
    return
  }
  if (chain.id !== walletClient.chain!.id) {
    await refreshWallet()
  }
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === walletClient.chain!.id),
    transport: http(RPC_URL[walletClient.chain!.id]),
  })
  try {
    const hash = await walletClient.sendTransaction({
      data: transaction.data,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas,
      account: walletClient.account!,
      chain,
    })
    await publicClient.waitForTransactionReceipt({ hash })
    return hash
  } catch (e) {
    console.error('Failed to send transaction', e)
    await refreshWallet()
  }
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
