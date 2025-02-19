import {
  DatafeedConfiguration,
  ResolutionString,
} from '../public/static/charting_library'
import { SUPPORTED_INTERVALS } from '../utils/chart'

export const CONFIGURATION_DATA: Partial<DatafeedConfiguration> &
  Required<
    Pick<
      DatafeedConfiguration,
      'supported_resolutions' | 'exchanges' | 'symbols_types'
    >
  > = {
  supported_resolutions: SUPPORTED_INTERVALS.map(
    (interval) => interval[0],
  ) as ResolutionString[],
  exchanges: [
    {
      value: 'Clober',
      name: 'Clober',
      desc: 'Clober',
    },
  ],
  symbols_types: [
    {
      name: 'crypto',
      // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
      value: 'crypto',
    },
  ],
}
