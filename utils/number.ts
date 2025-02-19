import BigNumber from 'bignumber.js'

import { findFirstNonZeroIndex } from './bignumber'

export const POLLY_FILL_DECIMALS = 4

export const toCommaSeparated = (number: string) => {
  const parts = number.split('.')
  const integer = parts[0]
  const decimal = parts[1]
  const formattedInteger =
    (integer.startsWith('-') ? '-' : '') +
    integer.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger
}

export const toShortNumber = (number: number): string => {
  const index = findFirstNonZeroIndex(number) - 1
  if (index === -1) {
    return number.toFixed(2)
  }
  if (index <= 3) {
    return number.toFixed(index + 1 + POLLY_FILL_DECIMALS)
  }
  const list = [
    '₀',
    '₁',
    '₂',
    '₃',
    '₄',
    '₅',
    '₆',
    '₇',
    '₈',
    '₉',
    '₁₀',
    '₁₁',
    '₁₂',
    '₁₃',
    '₁₄',
    '₁₅',
    '₁₆',
    '₁₇',
    '₁₈',
    '₁₉',
    '₂₀',
  ]
  const char = list[index]
  return (
    `0.0${char}` +
    new BigNumber(number)
      .toFixed(100)
      .slice(index + 2, index + 2 + POLLY_FILL_DECIMALS)
  )
}

const KILO = '1000'
const MILLION = '1000000'
const BILLION = '1000000000'
const TRILLION = '1000000000000'

export const toHumanReadableString = (value: BigNumber): string => {
  let abbreviatedDollarValue = value
  let suffix = ''
  if (value.gte(TRILLION)) {
    abbreviatedDollarValue = value.div(TRILLION)
    suffix = 'T'
  } else if (value.gte(BILLION)) {
    abbreviatedDollarValue = value.div(BILLION)
    suffix = 'B'
  } else if (value.gte(MILLION)) {
    abbreviatedDollarValue = value.div(MILLION)
    suffix = 'M'
  } else if (value.gte(KILO)) {
    abbreviatedDollarValue = value.div(KILO)
    suffix = 'K'
  }
  return `${toCommaSeparated(abbreviatedDollarValue.toFixed(1))}${suffix}`
}
