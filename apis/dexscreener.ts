import { CHAIN_IDS } from '@clober/v2-sdk'

import { TokenInfo } from '../model/token-info'
import handler from '../pages/api/chains/[chainId]/base-tokens/[base]/quote-tokens/[quote]'

export async function fetchTokenInfo({
  chainId,
  base,
  quote,
}: {
  chainId: CHAIN_IDS
  base: `0x${string}`
  quote: `0x${string}`
}): Promise<TokenInfo | undefined> {
  try {
    
    const { tokenInfo
    } = await handler(chainId as unknown as string, base, quote)
    return tokenInfo
  } catch (error) {
    console.log('fetchTokenInfo error', error)
  }
}
