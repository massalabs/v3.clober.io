import React, { useState } from 'react'
import { getAddress } from 'viem'

import { Currency } from '../../model/currency'

const cache = new Map<string, string>() // baseCurrency -> poolAddress

export const IframeChartContainer = ({
  setShowOrderBook,
  baseCurrency,
  poolAddress,
  chainName,
}: {
  setShowOrderBook: (showOrderBook: boolean) => void
  baseCurrency: Currency
  poolAddress: `0x${string}` | undefined
  chainName: string
}) => {
  const [fullscreen, setFullscreen] = useState(false)
  if (poolAddress) {
    cache.set(baseCurrency.symbol, poolAddress)
  } else if (!poolAddress && cache.has(baseCurrency.symbol)) {
    poolAddress = getAddress(cache.get(baseCurrency.symbol)!)
  }

  return (
    <>
      {fullscreen && (
        <div className="flex flex-col rounded-2xl bg-[#171b24] overflow-hidden min-h-[280px] w-full md:w-[480px] lg:w-[740px]" />
      )}
      <div
        className={`flex flex-col bg-[#171b24] overflow-hidden ${
          fullscreen
            ? 'w-full fixed left-0 top-0 right-0 bottom-0 z-10'
            : 'rounded-2xl min-h-[280px] h-[500px] lg:h-full w-full md:w-[480px] lg:w-[740px] z-[0]'
        }`}
      >
        <div className="left-0 top-0 right-20 z-20 flex items-center justify-end gap-2 px-4 py-2">
          <button
            onClick={() => setShowOrderBook(true)}
            className="hidden lg:flex w-[200px] h-7 px-2.5 py-1.5 bg-blue-500/20 rounded-lg justify-center items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
            >
              <g clipPath="url(#clip0_164_5640)">
                <path
                  d="M10.6304 8.5H1.63037M10.6304 8.5L9.13037 10M10.6304 8.5L9.13037 7M3.13037 5L1.63037 3.5M1.63037 3.5L3.13037 2M1.63037 3.5H10.6304"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_164_5640">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(0.130371)"
                  />
                </clipPath>
              </defs>
            </svg>
            <div className="text-center text-blue-400 text-[13px] font-semibold">
              View OrderBook
            </div>
          </button>
          <div className="w-full mr-auto sm:ml-auto flex">
            <button
              className="ml-auto p-0 pl-2 bg-transparent"
              onClick={() => setFullscreen((x) => !x)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="block w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] stroke-gray-500 hover:stroke-gray-200"
              >
                <path
                  d="M11 2H14V5"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path
                  d="M10 6L13 3"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 14H2V11"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
                <path
                  d="M6 10L3 13"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {poolAddress ? (
          <iframe
            id="dextools-widget"
            title="DEXTools Trading Chart"
            className="w-full h-full"
            src={`https://www.dextools.io/widget-chart/en/${chainName}/pe-light/${poolAddress.toLowerCase()}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=true`}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
