import axios from 'axios'

import { TokenInfo } from '../model/token-info'

export async function fetchTokenInfo({
  chainId,
  base,
  quote,
}: {
  chainId: number
  base: `0x${string}`
  quote: `0x${string}`
}): Promise<TokenInfo | null> {
  try {
    const {
      data: { tokenInfo },
    } = (await axios.get(
      `/api/chains/${chainId}/base-tokens/${base}/quote-tokens/${quote}`,
    )) as {
      data: { tokenInfo: TokenInfo }
    }
    return tokenInfo
  } catch (error) {
    console.log('fetchTokenInfo error', error)
    return null
  }
}
