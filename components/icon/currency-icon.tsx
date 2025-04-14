import React from 'react'

import { Currency, getLogo } from '../../model/currency'
import { Chain } from '../../model/chain'

export const CurrencyIcon = ({
  chain,
  currency,
  ...props
}: {
  chain: Chain
  currency: Currency
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [tryCount, setTryCount] = React.useState(0)
  return (
    <img
      className="rounded-full"
      src={currency && currency.icon ? currency.icon : getLogo(currency)}
      onError={(e) => {
        if (chain.testnet || tryCount >= 1) {
          e.currentTarget.src = '/unknown.svg'
          return
        } else {
          e.currentTarget.src = chain
            ? `https://dd.dexscreener.com/ds-data/tokens/${
                chain.name
              }/${currency.address.toLowerCase()}.png?size=lg`
            : '/unknown.svg'
          setTryCount((count) => count + 1)
        }
      }}
      {...props}
    />
  )
}
