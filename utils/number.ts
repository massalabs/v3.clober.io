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

export const removeZeroTail = (number: string) => {
  // 0.001000 -> 0.001
  const parts = number.split('.')
  if (parts.length === 1) {
    return number // no decimal
  }
  const decimal = parts[1]
  let i = decimal.length - 1
  while (decimal[i] === '0') {
    i -= 1
  }
  if (i === -1) {
    return parts[0]
  }
  return `${parts[0]}.${decimal.slice(0, i + 1)}`.replace(/\.$/, '')
}

export const toShortNumber = (number: BigNumber.Value): string => {
  number = new BigNumber(number).toNumber()
  const integer = new BigNumber(number).integerValue()
  if (integer.gt(0)) {
    return removeZeroTail(number.toFixed(2))
  }
  const index = findFirstNonZeroIndex(number) - 1
  if (index === -1) {
    return removeZeroTail(number.toFixed(2))
  }
  if (index <= 3) {
    return removeZeroTail(number.toFixed(index + 1 + POLLY_FILL_DECIMALS))
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
    '₂₁',
    '₂₂',
    '₂₃',
    '₂₄',
    '₂₅',
    '₂₆',
    '₂₇',
    '₂₈',
    '₂₉',
    '₃₀',
    '₃₁',
    '₃₂',
    '₃₃',
    '₃₄',
    '₃₅',
    '₃₆',
    '₃₇',
    '₃₈',
    '₃₉',
    '₄₀',
    '₄₁',
    '₄₂',
    '₄₃',
    '₄₄',
    '₄₅',
    '₄₆',
    '₄₇',
    '₄₈',
  ]
  const char = list[index]
  return removeZeroTail(
    `0.0${char}` +
      new BigNumber(number)
        .toFixed(100)
        .slice(index + 2, index + 2 + POLLY_FILL_DECIMALS),
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
