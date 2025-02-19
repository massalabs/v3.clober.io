import React from 'react'

import { CurrencyIcon } from '../icon/currency-icon'
import { Currency } from '../../model/currency'

export const CurrencySelectButton = ({
  currency,
  onCurrencyClick,
}: {
  currency?: Currency
  onCurrencyClick?: () => void
}) => {
  return (
    <button
      className="flex h-11 sm:h-14 w-full rounded-xl items-center bg-gray-700 gap-2 pl-4 pr-3 py-3 sm:pl-5 sm:pr-4 sm:py-4"
      onClick={onCurrencyClick}
    >
      <div className="w-4 h-4 sm:w-5 sm:h-5 relative">
        {currency ? <CurrencyIcon currency={currency} /> : <></>}
      </div>
      <div className="text-sm sm:text-base text-white">
        {currency ? currency.symbol : ''}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex ml-auto"
      >
        <g opacity="0.5">
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  )
}
