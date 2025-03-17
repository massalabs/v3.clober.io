import React from 'react'
import BigNumber from 'bignumber.js'
import { Market } from '@clober/v2-sdk'

import { Decimals } from '../model/decimals'
import { toPlacesString } from '../utils/bignumber'

import DecimalsSelector from './selector/decimals-selector'

const MAX_N = 18

function logTransform(arr: number[]) {
  return arr.map((x) => Math.min(Math.log(x + 1) * 100), 100)
}

export default function OrderBook({
  market,
  bids,
  asks,
  availableDecimalPlacesGroups,
  selectedDecimalPlaces,
  setSelectedDecimalPlaces,
  setDepthClickedIndex,
  setShowOrderBook,
  setTab,
  ...props
}: {
  market: Market | undefined
  bids: { price: string; size: string }[]
  asks: { price: string; size: string }[]
  availableDecimalPlacesGroups: Decimals[]
  selectedDecimalPlaces: Decimals | undefined
  setSelectedDecimalPlaces: (decimals: Decimals) => void
  setDepthClickedIndex: (index: { isBid: boolean; index: number }) => void
  setShowOrderBook: (showOrderBook: boolean) => void
  setTab: (tab: 'swap' | 'limit') => void
} & React.HTMLAttributes<HTMLDivElement>) {
  const normalizedBids = logTransform(
    bids.map(({ size }) =>
      new BigNumber(size)
        .times(100)
        .div(
          bids
            .sort((a, b) => new BigNumber(b.price).minus(a.price).toNumber())
            .slice(0, MAX_N)
            .reduce((acc, { size }) => acc.plus(size), new BigNumber(0)),
        )
        .toNumber(),
    ),
  ).map((size, index) => ({ ...bids[index], normalizedSize: size }))
  const normalizedAsks = logTransform(
    asks.map(({ size }) =>
      new BigNumber(size)
        .times(100)
        .div(
          asks
            .sort((a, b) => new BigNumber(a.price).minus(b.price).toNumber())
            .slice(0, MAX_N)
            .reduce((acc, { size }) => acc.plus(size), new BigNumber(0)),
        )
        .toNumber(),
    ),
  ).map((size, index) => ({ ...asks[index], normalizedSize: size }))

  return (
    <div {...props}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowOrderBook(false)}
          className="hidden lg:flex w-[140px] h-7 px-2.5 py-1.5 bg-blue-500/20 rounded-lg justify-center items-center gap-2"
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
            View Chart
          </div>
        </button>

        {selectedDecimalPlaces && availableDecimalPlacesGroups.length > 0 ? (
          <div className="ml-auto flex items-center gap-2 mr-1.5 md:mr-0">
            <DecimalsSelector
              availableDecimalPlacesGroups={availableDecimalPlacesGroups}
              value={selectedDecimalPlaces}
              onValueChange={setSelectedDecimalPlaces}
            />
          </div>
        ) : (
          <></>
        )}
      </div>

      {/*mobile*/}
      <div className="flex lg:hidden text-xs overflow-hidden relative h-full">
        {market ? (
          <>
            <div className="flex flex-1 flex-col basis-0">
              <div className="flex justify-between text-gray-500 gap-4 sm:gap-12 px-2 mb-1 sm:mb-3">
                <div>Amount</div>
                <div>Price</div>
              </div>
              {normalizedBids
                .sort((a, b) =>
                  new BigNumber(b.price).minus(a.price).toNumber(),
                )
                .filter(({ size }) => parseInt(size).toString().length < 20)
                .slice(0, 100)
                .map(({ price, size, normalizedSize }, index) => {
                  return (
                    <button
                      key={`bid-${index}`}
                      className="px-2 flex items-center justify-between shrink-0 relative tabular-nums"
                      onClick={() => {
                        setDepthClickedIndex({ isBid: true, index })
                        setTab('limit')
                      }}
                    >
                      <div className="text-gray-200">
                        {toPlacesString(size)}
                      </div>
                      <div className="text-green-500">{price}</div>
                      <div
                        className="absolute h-full right-0 bg-[#39e79f]/10"
                        style={{
                          width: `${normalizedSize}%`,
                        }}
                      />
                    </button>
                  )
                })}
            </div>
            <div className="flex flex-1 flex-col basis-0">
              <div className="flex justify-between text-gray-500 gap-4 sm:gap-12 px-2 mb-1 sm:mb-3">
                <div>Price</div>
                <div>Amount</div>
              </div>
              {normalizedAsks
                .sort((a, b) =>
                  new BigNumber(a.price).minus(b.price).toNumber(),
                )
                .filter(({ size }) => parseInt(size).toString().length < 20)
                .slice(0, 100)
                .map(({ price, size, normalizedSize }, index) => {
                  return (
                    <button
                      key={`ask-${index}`}
                      className="px-2 flex items-center justify-between shrink-0 relative tabular-nums"
                      onClick={() => {
                        setDepthClickedIndex({ isBid: false, index })
                        setTab('limit')
                      }}
                    >
                      <div className="text-red-500">{price}</div>
                      <div className="text-gray-200">
                        {toPlacesString(size)}
                      </div>
                      <div
                        className="absolute h-full left-0 bg-red-500/10"
                        style={{
                          width: `${normalizedSize}%`,
                        }}
                      />
                    </button>
                  )
                })}
            </div>
          </>
        ) : (
          <div
            role="status"
            className="flex justify-center items-center w-full h-full"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 animate-spin text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}
      </div>

      {/*pc*/}
      <div className="hidden lg:flex flex-col w-full h-full gap-[20px] text-[13px]">
        <div className="w-full h-4 justify-start items-center gap-6 flex">
          <div className="grow shrink basis-0 h-4 justify-end items-start gap-4 flex">
            <div className="flex-1 text-left text-gray-500 text-xs font-medium">
              Amount
            </div>
            <div className="flex-1 text-right text-gray-500 text-xs font-medium">
              Price
            </div>
          </div>
          <div className="grow shrink basis-0 h-4 justify-start items-start gap-4 flex">
            <div className="flex-1 text-left text-gray-500 text-xs font-medium">
              Price
            </div>
            <div className="flex-1 text-right text-gray-500 text-xs font-medium">
              Amount
            </div>
          </div>
        </div>

        <div className="flex flex-row h-full gap-0.5">
          {market ? (
            <>
              <div className="w-full h-full flex flex-1 flex-col basis-0 overflow-hidden">
                {normalizedBids
                  .sort((a, b) =>
                    new BigNumber(b.price).minus(a.price).toNumber(),
                  )
                  .slice(0, MAX_N)
                  .map(({ price, size, normalizedSize }, index) => {
                    return (
                      <button
                        key={`bid-${index}`}
                        className="h-6 pr-3 py-1 flex items-center justify-between shrink-0 relative tabular-nums gap-4"
                        onClick={() => {
                          setDepthClickedIndex({ isBid: true, index })
                          setTab('limit')
                        }}
                      >
                        <div className="flex-1 text-left text-gray-200">
                          {toPlacesString(size)}
                        </div>
                        <div className="text-right text-green-500">{price}</div>
                        <div
                          className="absolute h-full right-0 bg-[#39e79f]/10"
                          style={{
                            width: `${normalizedSize}%`,
                          }}
                        />
                      </button>
                    )
                  })}
              </div>
              <div className="w-full h-full flex flex-1 flex-col basis-0 overflow-hidden">
                {normalizedAsks
                  .sort((a, b) =>
                    new BigNumber(a.price).minus(b.price).toNumber(),
                  )
                  .slice(0, MAX_N)
                  .map(({ price, size, normalizedSize }, index) => {
                    return (
                      <button
                        key={`ask-${index}`}
                        className="h-6 pl-3 py-1 flex items-center justify-between shrink-0 relative tabular-nums gap-4"
                        onClick={() => {
                          setDepthClickedIndex({ isBid: false, index })
                          setTab('limit')
                        }}
                      >
                        <div className="text-left text-red-500">{price}</div>
                        <div className="flex-1 text-right text-gray-200">
                          {toPlacesString(size)}
                        </div>
                        <div
                          className="absolute h-full left-0 bg-red-500/10"
                          style={{
                            width: `${normalizedSize}%`,
                          }}
                        />
                      </button>
                    )
                  })}
              </div>
            </>
          ) : (
            <div
              role="status"
              className="flex justify-center items-center w-full h-full"
            >
              <svg
                aria-hidden="true"
                className="w-8 h-8 animate-spin text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
