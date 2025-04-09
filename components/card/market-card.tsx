import React from 'react'
import { CHAIN_IDS, Currency } from '@clober/v2-sdk'
import { NextRouter } from 'next/router'
import BigNumber from 'bignumber.js'
import { Tooltip } from 'react-tooltip'

import { CurrencyIcon } from '../icon/currency-icon'
import { toHumanReadableString, toShortNumber } from '../../utils/number'
import { QuestionMarkSvg } from '../svg/question-mark-svg'

export const MarketCard = ({
  chainId,
  baseCurrency,
  quoteCurrency,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createAt,
  price,
  dailyVolume,
  fdv,
  dailyChange,
  router,
}: {
  chainId: CHAIN_IDS
  baseCurrency: Currency
  quoteCurrency: Currency
  createAt: number
  price: number
  dailyVolume: number
  fdv: number
  dailyChange: number
  router: NextRouter
}) => {
  return (
    <>
      <button
        onClick={() =>
          router.push(
            `/trade?inputCurrency=${baseCurrency.address}&outputCurrency=${quoteCurrency.address}&chainId=${chainId}`,
          )
        }
        rel="noreferrer"
        className="hidden lg:flex max-w-[1072px] h-16 px-5 py-4 bg-gray-800 rounded-2xl justify-start items-center gap-4"
      >
        <div className="flex w-[200px] items-center gap-3">
          <div className="w-14 h-8 shrink-0 relative">
            <CurrencyIcon
              currency={baseCurrency}
              className="w-8 h-8 absolute left-0 top-0 z-[1] rounded-full"
            />
            <CurrencyIcon
              currency={quoteCurrency}
              className="w-8 h-8 absolute left-6 top-0 rounded-full"
            />
          </div>
          <div className="flex items-center text-white text-base font-bold gap-1">
            <div>{baseCurrency.symbol}</div>
            <div>-</div>
            <div>{quoteCurrency.symbol}</div>
          </div>
        </div>
        <div className="w-[160px] h-full text-white text-base font-bold gap-2 flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
            className="pt-0.5"
          >
            <path
              d="M6 10.6667L8.5 9V4.83333M1 9C1 9.98491 1.19399 10.9602 1.5709 11.8701C1.94781 12.7801 2.50026 13.6069 3.1967 14.3033C3.89314 14.9997 4.71993 15.5522 5.62987 15.9291C6.53982 16.306 7.51509 16.5 8.5 16.5C9.48491 16.5 10.4602 16.306 11.3701 15.9291C12.2801 15.5522 13.1069 14.9997 13.8033 14.3033C14.4997 13.6069 15.0522 12.7801 15.4291 11.8701C15.806 10.9602 16 9.98491 16 9C16 8.01509 15.806 7.03982 15.4291 6.12987C15.0522 5.21993 14.4997 4.39314 13.8033 3.6967C13.1069 3.00026 12.2801 2.44781 11.3701 2.0709C10.4602 1.69399 9.48491 1.5 8.5 1.5C7.51509 1.5 6.53982 1.69399 5.62987 2.0709C4.71993 2.44781 3.89314 3.00026 3.1967 3.6967C2.50026 4.39314 1.94781 5.21993 1.5709 6.12987C1.19399 7.03982 1 8.01509 1 9Z"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/*{convertTimeAgo(createAt * 1000)}*/} -
        </div>
        <div className="w-[140px] text-white text-base font-bold">
          ${toShortNumber(price)}
        </div>
        <div className="w-[140px] text-white text-base font-bold">
          ${toShortNumber(dailyVolume)}
        </div>
        <div className="w-[140px] text-white text-base font-bold">
          {fdv > 0 ? `$${toHumanReadableString(new BigNumber(fdv))}` : '-'}
        </div>
        <div
          className={`w-[120px] ${dailyChange === 0 ? 'text-white' : dailyChange > 0 ? 'text-green-500' : 'text-red-500'} text-base font-bold`}
        >
          {dailyChange.toFixed(2)}%
        </div>
        <div className="w-[59px] flex h-full text-white text-base font-bold items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M9.5 12L11.5 14L15.5 10M3.5 12C3.5 13.1819 3.73279 14.3522 4.18508 15.4442C4.63738 16.5361 5.30031 17.5282 6.13604 18.364C6.97177 19.1997 7.96392 19.8626 9.05585 20.3149C10.1478 20.7672 11.3181 21 12.5 21C13.6819 21 14.8522 20.7672 15.9442 20.3149C17.0361 19.8626 18.0282 19.1997 18.864 18.364C19.6997 17.5282 20.3626 16.5361 20.8149 15.4442C21.2672 14.3522 21.5 13.1819 21.5 12C21.5 10.8181 21.2672 9.64778 20.8149 8.55585C20.3626 7.46392 19.6997 6.47177 18.864 5.63604C18.0282 4.80031 17.0361 4.13738 15.9442 3.68508C14.8522 3.23279 13.6819 3 12.5 3C11.3181 3 10.1478 3.23279 9.05585 3.68508C7.96392 4.13738 6.97177 4.80031 6.13604 5.63604C5.30031 6.47177 4.63738 7.46392 4.18508 8.55585C3.73279 9.64778 3.5 10.8181 3.5 12Z"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <div className="flex lg:hidden w-full h-[168px] p-4 bg-gray-800 rounded-xl flex-col justify-center items-start gap-4">
        <div className="flex items-center gap-2 self-stretch">
          <div className="w-10 h-6 relative">
            <CurrencyIcon
              currency={baseCurrency}
              className="w-6 h-6 absolute left-0 top-0 z-[1] rounded-full"
            />
            <CurrencyIcon
              currency={quoteCurrency}
              className="w-6 h-6 absolute left-[16px] top-0 rounded-full"
            />
          </div>
          <div className="flex gap-1 justify-start items-center">
            <div className="text-white text-base font-bold">
              {baseCurrency.symbol}
            </div>
            <div className="text-white text-base font-bold">-</div>
            <div className="text-white text-base font-bold">
              {quoteCurrency.symbol}
            </div>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M9.5 12L11.5 14L15.5 10M3.5 12C3.5 13.1819 3.73279 14.3522 4.18508 15.4442C4.63738 16.5361 5.30031 17.5282 6.13604 18.364C6.97177 19.1997 7.96392 19.8626 9.05585 20.3149C10.1478 20.7672 11.3181 21 12.5 21C13.6819 21 14.8522 20.7672 15.9442 20.3149C17.0361 19.8626 18.0282 19.1997 18.864 18.364C19.6997 17.5282 20.3626 16.5361 20.8149 15.4442C21.2672 14.3522 21.5 13.1819 21.5 12C21.5 10.8181 21.2672 9.64778 20.8149 8.55585C20.3626 7.46392 19.6997 6.47177 18.864 5.63604C18.0282 4.80031 17.0361 4.13738 15.9442 3.68508C14.8522 3.23279 13.6819 3 12.5 3C11.3181 3 10.1478 3.23279 9.05585 3.68508C7.96392 4.13738 6.97177 4.80031 6.13604 5.63604C5.30031 6.47177 4.63738 7.46392 4.18508 8.55585C3.73279 9.64778 3.5 10.8181 3.5 12Z"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col w-full gap-[14px]">
          <div className="w-full flex flex-row flex-1 h-11 justify-start items-start gap-2">
            <div className="flex w-full flex-col justify-start items-center gap-2">
              <div className="self-stretch text-gray-400 text-xs">Age</div>
              <div className="flex flex-row self-stretch text-white text-sm font-bold items-center gap-1 text-nowrap">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="mt-0.5"
                >
                  <path
                    d="M6.66667 10.5556L9 9V5.11111M2 9C2 9.91925 2.18106 10.8295 2.53284 11.6788C2.88463 12.5281 3.40024 13.2997 4.05025 13.9497C4.70026 14.5998 5.47194 15.1154 6.32122 15.4672C7.1705 15.8189 8.08075 16 9 16C9.91925 16 10.8295 15.8189 11.6788 15.4672C12.5281 15.1154 13.2997 14.5998 13.9497 13.9497C14.5998 13.2997 15.1154 12.5281 15.4672 11.6788C15.8189 10.8295 16 9.91925 16 9C16 8.08075 15.8189 7.1705 15.4672 6.32122C15.1154 5.47194 14.5998 4.70026 13.9497 4.05025C13.2997 3.40024 12.5281 2.88463 11.6788 2.53284C10.8295 2.18106 9.91925 2 9 2C8.08075 2 7.1705 2.18106 6.32122 2.53284C5.47194 2.88463 4.70026 3.40024 4.05025 4.05025C3.40024 4.70026 2.88463 5.47194 2.53284 6.32122C2.18106 7.1705 2 8.08075 2 9Z"
                    stroke="#6B7280"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/*{convertTimeAgo(createAt * 1000)}*/}-
              </div>
            </div>
            <div className="flex w-full flex-col justify-start items-center gap-2">
              <div className="self-stretch text-gray-400 text-xs">Price</div>
              <div className="self-stretch text-white text-sm font-bold">
                ${toShortNumber(price)}
              </div>
            </div>
            <div className="flex flex-col justify-start items-center gap-2">
              <div className="flex w-full ml-auto self-stretch text-gray-400 text-xs text-nowrap gap-1">
                <div className="flex justify-center items-center mt-0.5">
                  <QuestionMarkSvg
                    data-tooltip-id="24h-volume-info"
                    data-tooltip-place="bottom-end"
                    data-tooltip-html={
                      'Cumulative volume from 00:00 UTC to now.'
                    }
                    className="w-3 h-3"
                  />
                  <Tooltip
                    id="24h-volume-info"
                    className="max-w-[300px] bg-gray-950 !opacity-100 z-[100]"
                    clickable
                  />
                </div>
                24h Volume
              </div>
              <div className="self-stretch text-white text-sm font-bold">
                ${toShortNumber(dailyVolume)}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row flex-1 h-11 justify-start items-start gap-2">
            <div className="flex w-full flex-col justify-start items-center gap-2">
              <div className="self-stretch text-gray-400 text-xs">FDV</div>
              <div className="flex flex-row self-stretch text-white text-sm font-bold items-center gap-1">
                {fdv > 0
                  ? `$${toHumanReadableString(new BigNumber(fdv))}`
                  : '-'}
              </div>
            </div>
            <div className="flex w-full flex-col justify-start items-center gap-2">
              <div className="self-stretch text-gray-400 text-xs">
                24h Change
              </div>
              <div className="self-stretch text-white text-sm font-bold">
                <div
                  className={`${
                    dailyChange === 0
                      ? 'text-white'
                      : dailyChange > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                  }`}
                >
                  {dailyChange.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-start items-center gap-2"></div>
          </div>
        </div>
      </div>
    </>
  )
}
