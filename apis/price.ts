import { getQuoteToken } from '@clober/v2-sdk'
import { isAddressEqual, parseUnits } from 'viem'
import BigNumber from 'bignumber.js'
import { EvmPriceServiceConnection, PriceFeed } from '@pythnetwork/pyth-evm-js'

import { AGGREGATORS } from '../constants/aggregators'
import { formatUnits } from '../utils/bigint'
import { Currency } from '../model/currency'
import { Asset } from '../model/future/asset'
import { Prices } from '../model/prices'

import { fetchQuotes } from './swap/quotes'

export const fetchPrice = async (
  chainId: number,
  currency0: Currency,
  currency1: Currency,
): Promise<BigNumber> => {
  const quoteToken = getQuoteToken({
    chainId: chainId,
    token0: currency0.address,
    token1: currency1.address,
  })
  const [quoteCurrency, baseCurrency] = isAddressEqual(
    quoteToken,
    currency0.address,
  )
    ? [currency0, currency1]
    : [currency1, currency0]
  try {
    const { amountOut } = await fetchQuotes(
      AGGREGATORS[chainId],
      baseCurrency,
      parseUnits('1', baseCurrency.decimals),
      quoteCurrency,
      20,
      1000n, // arbitrary gas price
    )
    return new BigNumber(formatUnits(amountOut, quoteCurrency.decimals))
  } catch (e) {
    console.error(e)
    return new BigNumber(0)
  }
}

export const fetchPythPrice = async (assets: Asset[]): Promise<Prices> => {
  const pythPriceService = new EvmPriceServiceConnection(
    'https://hermes.pyth.network',
  )
  const keys = [
    ...assets.map((asset) => {
      return {
        priceFeedId: asset.currency.priceFeedId,
        address: asset.currency.address,
      }
    }),
    ...assets.map((asset) => {
      return {
        priceFeedId: asset.collateral.priceFeedId,
        address: asset.collateral.address,
      }
    }),
  ]
  const prices: PriceFeed[] | undefined =
    await pythPriceService.getLatestPriceFeeds(keys.map((id) => id.priceFeedId))
  if (prices === undefined) {
    return {}
  }
  return prices.reduce((acc, priceFeed, index) => {
    const price = priceFeed.getPriceUnchecked()
    const key = keys[index]
    return {
      ...acc,
      [key.address]: price.getPriceAsNumberUnchecked(),
    }
  }, {} as Prices)
}
