import { createPublicClient, http, WalletClient } from 'viem'

import { Currency } from '../model/currency'
import { supportChains } from '../constants/chain'
import { ERC20_PERMIT_ABI } from '../abis/@openzeppelin/erc20-permit-abi'
import { RPC_URL } from '../constants/rpc-urls'

export const maxApprove = async (
  walletClient: WalletClient,
  currency: Currency,
  spender: `0x${string}`,
): Promise<`0x${string}` | undefined> => {
  if (!walletClient) {
    return
  }
  const publicClient = createPublicClient({
    chain: supportChains.find((chain) => chain.id === walletClient.chain!.id),
    transport: http(RPC_URL[walletClient.chain!.id]),
  })
  const hash = await walletClient.writeContract({
    address: currency.address,
    abi: ERC20_PERMIT_ABI,
    functionName: 'approve',
    args: [spender, 2n ** 256n - 1n],
    account: walletClient.account!,
    chain: walletClient.chain!,
  })
  await publicClient.waitForTransactionReceipt({ hash })
  return hash
}
