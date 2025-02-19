import BigNumber from 'bignumber.js'

import { findFirstNonZeroIndex, toPlacesString } from '../utils/bignumber'
import { toHumanReadableString, toShortNumber } from '../utils/number'

describe('Numbers', () => {
  it('findFirstNonZeroIndex', () => {
    expect(findFirstNonZeroIndex(1111.1023123)).toBe(1)
    expect(findFirstNonZeroIndex(0.1023123)).toBe(1)
    expect(findFirstNonZeroIndex(0.01023123)).toBe(2)
    expect(findFirstNonZeroIndex(0)).toBe(0)
    expect(findFirstNonZeroIndex(1000000)).toBe(0)
    expect(findFirstNonZeroIndex(123)).toBe(0)
    expect(findFirstNonZeroIndex(123.000000123)).toBe(7)
  })

  it('toPlacesString', () => {
    expect(toPlacesString(1111.1023123)).toBe('1111.1023')
    expect(toPlacesString(0.00000000001023123)).toBe('0.00000000001')
    expect(toPlacesString(1110.000001023123)).toBe('1110.0000')
    expect(toPlacesString(0.1023123)).toBe('0.1023')
    expect(toPlacesString(0.01023123)).toBe('0.0102')
    expect(toPlacesString(0)).toBe('0')
    expect(toPlacesString(1000000)).toBe('1000000.0000')
    expect(toPlacesString(123)).toBe('123.0000')
    expect(toPlacesString(123.000000123)).toBe('123.0000')
  })

  it('toShortNumber', () => {
    expect(toShortNumber(100)).toBe('100.00')
    expect(toShortNumber(10)).toBe('10.00')
    expect(toShortNumber(1)).toBe('1.00')
    expect(toShortNumber(0.1)).toBe('0.10000')
    expect(toShortNumber(0.01)).toBe('0.010000')
    expect(toShortNumber(0.001)).toBe('0.0010000')
    expect(toShortNumber(0.0001)).toBe('0.00010000')
    expect(toShortNumber(0.00001)).toBe('0.0₄1000')
    expect(toShortNumber(0.000001)).toBe('0.0₅1000')
    expect(toShortNumber(0.0000001)).toBe('0.0₆1000')
  })

  it('toDollarString', () => {
    expect(toHumanReadableString(new BigNumber(100000000))).toBe('100.0M')
    expect(toHumanReadableString(new BigNumber(10000000))).toBe('10.0M')
    expect(toHumanReadableString(new BigNumber(1000000))).toBe('1.0M')
    expect(toHumanReadableString(new BigNumber(100000))).toBe('100.0K')
  })
})
