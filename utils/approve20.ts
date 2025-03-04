import { createPublicClient, http, WalletClient } from 'viem'

import { Currency } from '../model/currency'
import { supportChains } from '../constants/chain'
import { ERC20_PERMIT_ABI } from '../abis/@openzeppelin/erc20-permit-abi'
import { RPC_URL } from '../constants/rpc-urls'
import { Chain } from '../model/chain'

import { buildTransaction } from './build-transaction'
import { sendTransaction } from './transaction'

export const maxApprove = async (
  chain: Chain,
  walletClient: WalletClient,
  currency: Currency,
  spender: `0x${string}`,
  disconnectAsync: () => Promise<void>,
): Promise<`0x${string}` | undefined> => {
  if (!walletClient) {
    return
  }
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === walletClient.chain!.id),
    transport: http(RPC_URL[walletClient.chain!.id]),
  })
  const transaction = await buildTransaction(publicClient, {
    address: currency.address,
    abi: ERC20_PERMIT_ABI,
    functionName: 'approve',
    args: [spender, 2n ** 256n - 1n],
    account: walletClient.account!,
    chain,
  })
  return sendTransaction(chain, walletClient, transaction, disconnectAsync)
}
