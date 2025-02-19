import { getQuoteToken } from '@clober/v2-sdk'
import { isAddressEqual, parseUnits } from 'viem'
import BigNumber from 'bignumber.js'

import { AGGREGATORS } from '../constants/aggregators'
import { formatUnits } from '../utils/bigint'
import { Currency } from '../model/currency'

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
