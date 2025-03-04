import React from 'react'

import { CurrencyIcon } from '../icon/currency-icon'
import {
  currentTimestampInSeconds,
  formatDate,
  getExpirationDateTextColor,
} from '../../utils/date'
import { formatDollarValue, formatUnits } from '../../utils/bigint'
import { UserPosition } from '../../model/future/user-position'
import { toCommaSeparated } from '../../utils/number'

export const FutureAssetShortPositionCard = ({
  position,
  loanAssetPrice,
  onAdjustMultiple,
}: {
  position: UserPosition
  loanAssetPrice: number
  onAdjustMultiple: () => void
}) => {
  const now = currentTimestampInSeconds()

  return (
    <div className="flex w-full pb-4 flex-col items-center gap-3 shrink-0 bg-[#171b24] rounded-xl">
      <div className="flex p-4 items-center self-stretch">
        <div className="flex items-center gap-3 flex-grow shrink-0 basis-0">
          <CurrencyIcon
            currency={position.asset.currency}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <div className="flex flex-col">
            <div className="w-[89px] text-xs text-red-400 font-semibold">
              Short
            </div>
            <div className="text-base font-bold">
              {position.asset.currency.symbol}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-end gap-0.5 font-bold">
          <div className="flex text-xs text-gray-400 justify-end font-normal">
            <div className="flex flex-row gap-1 items-center justify-center">
              Expires
            </div>
          </div>
          <div
            className={`flex gap-1 ${getExpirationDateTextColor(
              position.asset.expiration,
              now,
            )}`}
          >
            {formatDate(new Date(Number(position.asset.expiration) * 1000))}
          </div>
        </div>
      </div>
      <div className="flex px-4 py-0 flex-col items-start gap-8 flex-grow shrink-0 basis-0 self-stretch">
        <div className="flex flex-col items-start gap-3 flex-grow shrink-0 basis-0 self-stretch">
          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm  flex gap-1 items-center">
              Position Size
            </div>
            <div className="flex gap-1">
              <div className="text-sm sm:text-base">
                {formatUnits(
                  position.debtAmount ?? 0n,
                  position.asset.currency.decimals,
                  loanAssetPrice,
                )}{' '}
                {position.asset.currency.symbol}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Mark / Avg. Price
            </div>
            <div className="text-sm sm:text-base">
              {formatDollarValue(
                BigInt(10 ** position.asset.collateral.decimals),
                position.asset.collateral.decimals,
                loanAssetPrice,
              )}{' '}
              / ${toCommaSeparated((position?.averagePrice ?? 0).toFixed(2))}
            </div>
          </div>

          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Liq. Price
            </div>
            <div className="text-sm sm:text-base">
              ${toCommaSeparated((position?.liquidationPrice ?? 0).toFixed(2))}
            </div>
          </div>

          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              PnL
            </div>
            {position.pnl ? (
              <div className="flex gap-1">
                <div
                  className={`text-sm sm:text-base flex gap-1 ${
                    position.pnl >= 1 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {position.pnl >= 1 ? '+' : '-'}$
                  {toCommaSeparated(Math.abs(position.profit).toFixed(2))} (
                  {position.pnl >= 1 ? '+' : ''}
                  {(position.pnl * 100).toFixed(2)}%)
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="flex items-center gap-1 self-stretch">
            <div className="flex-grow flex-shrink basis-0 text-gray-400 text-sm">
              Current / Liq. LTV
            </div>
            <div className="text-sm sm:text-base">
              {(position?.ltv ?? 0).toFixed(2)}% /{'  '}
              {(
                (Number(position.asset.liquidationThreshold) * 100) /
                Number(position.asset.ltvPrecision)
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 self-stretch">
          <button
            className="w-full flex items-center font-bold justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-800 disabled:text-gray-500 px-3 py-2 text-sm"
            onClick={onAdjustMultiple}
          >
            Adjust
          </button>
        </div>
      </div>
    </div>
  )
}
