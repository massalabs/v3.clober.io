import { MARKET_HOURS } from '../constants/futures/asset'

export const SECONDS_IN_DAY = 60 * 60 * 24

export const isMarketClose = (assetId: string): boolean => {
  if (!MARKET_HOURS[assetId]) {
    return false
  }
  const now = currentTimestampInSeconds()
  const utcHoursMinutes =
    new Date(now * 1000).getUTCHours() * 100 +
    new Date(now * 1000).getUTCMinutes()
  return !(
    MARKET_HOURS[assetId].open <= utcHoursMinutes &&
    utcHoursMinutes < MARKET_HOURS[assetId].close
  )
}

export const formatDate = (date: Date): string =>
  Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date.setDate(date.getDate()))
    .replace(',', '')

export const currentTimestampInSeconds = (): number =>
  Math.floor(new Date().getTime() / 1000)

export const getExpirationDateTextColor = (
  expirationDate: number,
  now: number,
): string => {
  const daysLeft = getDaysBetweenDates(
    new Date(now * 1000),
    new Date(expirationDate * 1000),
  )
  if (daysLeft <= 3) {
    return 'text-red-500'
  }
  return ''
}

export const getDaysBetweenDates = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * SECONDS_IN_DAY))
}
