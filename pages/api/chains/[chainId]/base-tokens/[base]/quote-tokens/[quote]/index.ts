import { getAddress, isAddress, isAddressEqual, zeroAddress } from 'viem'
import axios from 'axios'

import { WETH } from '../../../../../../../../constants/currency'
import { TokenInfo } from '../../../../../../../../model/token-info'

type PairDto = {
  pairAddress: string
  baseToken: { address: string }
  quoteToken: { address: string }
  priceNative: string
  priceUsd: string
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  fdv: number
  marketCap: number
  pairCreatedAt: number
  info: {
    imageUrl: string
    websites: {
      label: string
      url: string
    }[]
    socials: {
      type: string
      url: string
    }[]
  }
}

const cache: {
  [key: string]: { tokenInfo: TokenInfo | undefined; timestamp: number }
} = {}

const buildTokenInfo = (pairs: PairDto[]): TokenInfo => {
  const mainPair = pairs.sort((a, b) => b.volume.h24 - a.volume.h24)[0]

  return {
    imageUrl: mainPair?.info?.imageUrl ?? '',
    fdv: mainPair?.fdv ?? 0,
    marketCap: mainPair?.marketCap ?? 0,
    info: {
      website: mainPair?.info?.websites?.[0]?.url ?? '',
      twitter:
        mainPair?.info?.socials.find((social) => social.type === 'twitter')
          ?.url ?? '',
      telegram:
        mainPair?.info?.socials.find((social) => social.type === 'telegram')
          ?.url ?? '',
    },
    volume: {
      h24: pairs.reduce((acc, pair) => acc + pair?.volume?.h24 || 0, 0),
      h6: pairs.reduce((acc, pair) => acc + pair?.volume?.h6 || 0, 0),
      h1: pairs.reduce((acc, pair) => acc + pair?.volume?.h1 || 0, 0),
      m5: pairs.reduce((acc, pair) => acc + pair?.volume?.m5 || 0, 0),
    },
    liquidity: {
      usd: pairs.reduce((acc, pair) => acc + pair?.liquidity?.usd || 0, 0),
      base: pairs.reduce((acc, pair) => acc + pair?.liquidity?.base || 0, 0),
      quote: pairs.reduce((acc, pair) => acc + pair?.liquidity?.quote || 0, 0),
    },
    priceNative: Number(mainPair?.priceNative ?? 0),
    priceUsd: Number(mainPair?.priceUsd ?? 0),
    pairAddress:
      mainPair && mainPair.pairAddress && isAddress(mainPair.pairAddress)
        ? getAddress(mainPair.pairAddress)
        : undefined,
  }
}

export default async function handler(
  chainId: string,
  base: string,
  quote: string,
): Promise<{ tokenInfo: TokenInfo | undefined }> {
  try {
    if (
      !chainId ||
      !base ||
      !quote ||
      typeof chainId !== 'string' ||
      typeof base !== 'string' ||
      typeof quote !== 'string'
    ) {
      throw new Error(
        JSON.stringify({
          status: 'error',
          message:
            'URL should be /api/chains/[chainId]/base-tokens/[base]/quote-tokens/[quote]',
        }),
      )
    }
    if (!isAddress(base) && !isAddress(quote)) {
      throw new Error(
        JSON.stringify({
          status: 'error',
          message: 'Invalid address',
        }),
      )
    }

    const id = Number(chainId)
    const baseAddress = getAddress(
      isAddressEqual(getAddress(base), zeroAddress) ? WETH[id].address : base,
    )
    const quoteAddress = getAddress(
      isAddressEqual(getAddress(quote), zeroAddress) ? WETH[id].address : quote,
    )

    const key = `${baseAddress}-${quoteAddress}`
    if (cache[key] && Date.now() - cache[key].timestamp < 1000 * 3) {
      return { tokenInfo: cache[key].tokenInfo }
    }

    const {
      data: { pairs },
    } = (await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${baseAddress}`,
    )) as {
      data: { pairs: PairDto[] }
    }

    const filterPairs = (pairs ?? []).filter(
      (pair) =>
        isAddressEqual(getAddress(pair.baseToken.address), baseAddress) &&
        isAddressEqual(getAddress(pair.quoteToken.address), quoteAddress),
    )
    if (filterPairs.length === 0) {
      const filterPairsByBase = (pairs ?? []).filter((pair) =>
        isAddressEqual(getAddress(pair.baseToken.address), baseAddress),
      )
      if (filterPairsByBase.length === 0) {
        throw new Error(
          JSON.stringify({
            status: 'error',
            message: 'Pair not found',
          }),
        )
      }
      const tokenInfo = buildTokenInfo(filterPairsByBase)
      cache[key] = {
        tokenInfo,
        timestamp: Date.now(),
      }
      return {
        tokenInfo,
      }
    }

    const tokenInfo = buildTokenInfo(filterPairs)
    cache[key] = {
      tokenInfo,
      timestamp: Date.now(),
    }
    return {
      tokenInfo,
    }
  } catch (error) {
    console.log('fetchTokenInfo error', error)
    throw new Error(
      JSON.stringify({
        status: 'error',
        message: 'Internal server error',
      }),
    )
  }
}
