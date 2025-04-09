import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'

TimeAgo.addDefaultLocale(en)

export const convertTimeAgo = (timestamp: number) => {
  try {
    const timeAgo = new TimeAgo('en-US')
    return timeAgo.format(new Date(timestamp))
  } catch {
    return '-'
  }
}

export const convertShortTimeAgo = (timestamp: number) => {
  try {
    const timeAgo = new TimeAgo('en-US')
    return timeAgo.format(new Date(timestamp), 'mini')
  } catch {
    return '-'
  }
}

export const convertRemainingTime = (timestamp: number) => {
  const now = new Date().getTime()
  const distance = timestamp - now
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  )
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  return `${hours}H ${minutes}M ${seconds}S`
}
