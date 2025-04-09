import React, { useCallback } from 'react'
import CountUp from 'react-countup'

import { toHumanReadableString } from '../../utils/number'

export const UserPointButton = ({ score }: { score: number }) => {
  const countUpFormatter = useCallback((value: number): string => {
    return toHumanReadableString(value)
  }, [])
  return (
    <div className="cursor-pointer w-[115px] flex h-8 p-2 sm:px-3 text-xs sm:text-sm lg:text-base justify-end bg-gray-800 hover:bg-gray-700 items-center gap-1 shrink-0 border-solid rounded">
      <span>
        <CountUp
          end={score}
          formattingFn={countUpFormatter}
          preserveValue
          useEasing={false}
          duration={1}
        />
      </span>
      <span className="text-gray-400">points</span>
    </div>
  )
}
