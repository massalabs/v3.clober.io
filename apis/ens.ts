import axios from 'axios'
import { getAddress } from 'viem'
import { monadTestnet } from 'viem/chains'

import { currentTimestampInSeconds } from '../utils/date'
import { Chain } from '../model/chain'

const cache: {
  [chainId: string]: {
    [address: `0x${string}`]: string | null
  }
} = {}

export const fetchEnsName = async (
  chain: Chain,
  address: `0x${string}`,
): Promise<string | null> => {
  address = getAddress(address)
  const chainId = chain.id.toString()

  if (!cache[chainId]) {
    cache[chainId] = {}
  }
  if (cache[chainId][address]) {
    return cache[chainId][address]
  }

  const now = currentTimestampInSeconds()
  if (chain.id === monadTestnet.id) {
    const { data } = await axios.get<
      { domain_name: string; expires_at: string; tld: string }[]
    >(`https://monad.alldomains.id/api/get-user-domains/${address}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 1000 * 2,
    })
    const available = data
      .filter((item) => {
        return Number(item.expires_at) > now
      })
      .sort((a, b) => Number(a.expires_at) - Number(b.expires_at))
    const ens =
      available.length > 0
        ? `${available[0].domain_name}${available[0].tld}`
        : null
    if (ens) {
      cache[chainId][address] = ens
    }
    return ens
  }
  return null
}
