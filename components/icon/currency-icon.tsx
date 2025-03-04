import React from 'react'
import { isAddressEqual } from 'viem'

import { Currency, getLogo } from '../../model/currency'
import { supportChains } from '../../constants/chain'
import { LOCAL_STORAGE_CHAIN_KEY } from '../../contexts/chain-context'
import { WHITELISTED_CURRENCIES } from '../../constants/currency'

export const CurrencyIcon = ({
  currency,
  ...props
}: {
  currency: Currency
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [tryCount, setTryCount] = React.useState(0)
  const chainId = Number(localStorage.getItem(LOCAL_STORAGE_CHAIN_KEY) ?? '0')
  const _currency = WHITELISTED_CURRENCIES[chainId].find((c) =>
    isAddressEqual(c.address, currency.address),
  )
  const chain = supportChains.find((chain) => chain.id === chainId)
  return (
    <img
      className="rounded-full"
      src={_currency && _currency.icon ? _currency.icon : getLogo(currency)}
      onError={(e) => {
        if (tryCount >= 1) {
          e.currentTarget.src = '/unknown.svg'
          return
        }
        e.currentTarget.src = chain
          ? `https://dd.dexscreener.com/ds-data/tokens/${
              chain.name
            }/${currency.address.toLowerCase()}.png?size=lg`
          : '/unknown.svg'
        setTryCount((count) => count + 1)
      }}
      {...props}
    />
  )
}
