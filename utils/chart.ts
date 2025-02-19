import { CHART_LOG_INTERVALS } from '@clober/v2-sdk'

import { ResolutionString } from '../public/static/charting_library'

export const SUPPORTED_INTERVALS = [
  ['1', '1m', 60],
  ['3', '3m', 60 * 3],
  ['5', '5m', 60 * 5],
  ['15', '15m', 60 * 15],
  ['60', '1h', 60 * 60],
  ['240', '4h', 60 * 60 * 4],
  ['1D', '1d', 60 * 60 * 24],
  ['1W', '1w', 60 * 60 * 24 * 7],
] as [ResolutionString, CHART_LOG_INTERVALS, number][]
