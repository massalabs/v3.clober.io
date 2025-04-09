import React, { useMemo, useRef, useState } from 'react'
import { createPublicClient, http } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { Tooltip } from 'react-tooltip'

import { MarketCard } from '../components/card/market-card'
import { useChainContext } from '../contexts/chain-context'
import { SearchSvg } from '../components/svg/search-svg'
import { fetchAllMarkets } from '../apis/market'
import { useCurrencyContext } from '../contexts/currency-context'
import { supportChains } from '../constants/chain'
import { RPC_URL } from '../constants/rpc-url'
import { QuestionMarkSvg } from '../components/svg/question-mark-svg'
import { TriangleDownSvg } from '../components/svg/triangle-down-svg'
import { Market } from '../model/market'

type SortOption = 'none' | 'desc' | 'asc'

export const DiscoverContainer = () => {
  const { selectedChain } = useChainContext()
  const { whitelistCurrencies, prices } = useCurrencyContext()
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: supportChains.find((chain) => chain.id === selectedChain.id),
      transport: http(RPC_URL[selectedChain.id]),
    })
  }, [selectedChain.id])
  const prevMarkets = useRef<Market[]>([])

  const [searchValue, setSearchValue] = React.useState('')
  const [marketSortOption, setMarketSortOption] = useState<SortOption>('none')
  const [priceSortOption, setPriceSortOption] = useState<SortOption>('none')
  const [dailyVolumeSortOption, setDailyVolumeSortOption] =
    useState<SortOption>('none')
  const [fdvSortOption, setFdvSortOption] = useState<SortOption>('none')
  const [dailyChangeSortOption, setDailyChangeSortOption] =
    useState<SortOption>('none')
  const [verifiedSortOption, setVerifiedSortOption] =
    useState<SortOption>('none')

  const { data: markets } = useQuery({
    queryKey: ['markets', selectedChain.id],
    queryFn: async () => {
      const market = await fetchAllMarkets(
        publicClient,
        selectedChain,
        prices,
        whitelistCurrencies.map((currency) => currency.address),
        prevMarkets.current,
      )
      prevMarkets.current = market
      return market
    },
    refetchInterval: 2 * 1000, // checked
    refetchIntervalInBackground: true,
  })

  const filteredMarkets = useMemo(() => {
    const _market = (markets ?? [])
      .filter(
        (market) =>
          market.baseCurrency.symbol
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          market.quoteCurrency.symbol
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          market.baseCurrency.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          market.quoteCurrency.name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          market.baseCurrency.address
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          market.quoteCurrency.address
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          `${market.baseCurrency.name}${market.quoteCurrency.name}`
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          `${market.baseCurrency.symbol}${market.quoteCurrency.symbol}`
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      )
      .sort((a, b) => {
        if (marketSortOption === 'asc') {
          return a.price - b.price
        } else if (marketSortOption === 'desc') {
          return b.price - a.price
        }
        return 0
      })
      .sort((a, b) => {
        if (priceSortOption === 'asc') {
          return a.price - b.price
        } else if (priceSortOption === 'desc') {
          return b.price - a.price
        }
        return 0
      })
      .sort((a, b) => {
        if (dailyVolumeSortOption === 'asc') {
          return a.dailyVolume - b.dailyVolume
        } else if (dailyVolumeSortOption === 'desc') {
          return b.dailyVolume - a.dailyVolume
        }
        return 0
      })
      .sort((a, b) => {
        if (fdvSortOption === 'asc') {
          return a.fdv - b.fdv
        } else if (fdvSortOption === 'desc') {
          return b.fdv - a.fdv
        }
        return 0
      })
      .sort((a, b) => {
        if (dailyChangeSortOption === 'asc') {
          return a.dailyChange - b.dailyChange
        } else if (dailyChangeSortOption === 'desc') {
          return b.dailyChange - a.dailyChange
        }
        return 0
      })
      .sort((a, b) => {
        if (verifiedSortOption === 'asc') {
          return a.verified ? -1 : 1
        } else if (verifiedSortOption === 'desc') {
          return b.verified ? -1 : 1
        }
        return 0
      })

    if (
      marketSortOption === 'none' &&
      priceSortOption === 'none' &&
      dailyVolumeSortOption === 'none' &&
      fdvSortOption === 'none' &&
      dailyChangeSortOption === 'none' &&
      verifiedSortOption === 'none'
    ) {
      return _market
        .sort((a, b) => b.liquidityUsd - a.liquidityUsd)
        .sort((a, b) => b.dailyVolume - a.dailyVolume)
    }

    return _market
  }, [
    dailyChangeSortOption,
    dailyVolumeSortOption,
    fdvSortOption,
    marketSortOption,
    markets,
    priceSortOption,
    searchValue,
    verifiedSortOption,
  ])

  return (
    <div className="text-white mb-4 flex w-full lg:w-[1072px]  flex-col items-center mt-6 lg:mt-8 px-4 lg:px-0 gap-4 lg:gap-8">
      <div className="flex max-w-[480px] lg:max-w-full mr-auto w-full lg:w-[432px] flex-col relative rounded shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <div className="relative h-4 w-4">
            <SearchSvg />
          </div>
        </div>
        <div className="inline-block">
          <div className="invisible h-0 mx-[29px]" aria-hidden="true">
            Search by markets
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="inline w-full pl-10 py-2 lg:py-3 text-white bg-transparent rounded-xl border border-solid border-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-400 flex-col placeholder:text-gray-400 text-xs sm:text-sm"
            placeholder="Search markets"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col w-full h-full gap-6">
        <div className="hidden lg:flex self-stretch px-4 justify-start items-center gap-4">
          <button
            onClick={() => {
              if (marketSortOption === 'none') {
                setMarketSortOption('desc')
              } else if (marketSortOption === 'desc') {
                setMarketSortOption('asc')
              } else {
                setMarketSortOption('none')
              }
            }}
            className="w-[330px] flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
          >
            Market
            {marketSortOption === 'asc' ? (
              <TriangleDownSvg className="rotate-180" />
            ) : marketSortOption === 'desc' ? (
              <TriangleDownSvg />
            ) : (
              <></>
            )}
          </button>
          <div className="w-[180px] text-sm font-semibold">Age</div>
          <button
            onClick={() => {
              if (priceSortOption === 'none') {
                setPriceSortOption('desc')
              } else if (priceSortOption === 'desc') {
                setPriceSortOption('asc')
              } else {
                setPriceSortOption('none')
              }
            }}
            className="w-[160px] flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
          >
            Price
            {priceSortOption === 'asc' ? (
              <TriangleDownSvg className="rotate-180" />
            ) : priceSortOption === 'desc' ? (
              <TriangleDownSvg />
            ) : (
              <></>
            )}
          </button>
          <button
            onClick={() => {
              if (dailyVolumeSortOption === 'none') {
                setDailyVolumeSortOption('desc')
              } else if (dailyVolumeSortOption === 'desc') {
                setDailyVolumeSortOption('asc')
              } else {
                setDailyVolumeSortOption('none')
              }
            }}
            className="flex flex-row gap-1 w-[160px] text-sm font-semibold hover:underline cursor-pointer"
          >
            24h Volume
            <div className="flex mr-auto justify-center items-center">
              <QuestionMarkSvg
                data-tooltip-id="24h-volume-info"
                data-tooltip-place="bottom-end"
                data-tooltip-html={'Cumulative volume from 00:00 UTC to now.'}
                className="w-3 h-3"
              />
              <Tooltip
                id="24h-volume-info"
                className="max-w-[300px] bg-gray-950 !opacity-100 z-[100]"
                clickable
              />
              {dailyVolumeSortOption === 'asc' ? (
                <TriangleDownSvg className="rotate-180" />
              ) : dailyVolumeSortOption === 'desc' ? (
                <TriangleDownSvg />
              ) : (
                <></>
              )}
            </div>
          </button>
          <button
            onClick={() => {
              if (fdvSortOption === 'none') {
                setFdvSortOption('desc')
              } else if (fdvSortOption === 'desc') {
                setFdvSortOption('asc')
              } else {
                setFdvSortOption('none')
              }
            }}
            className="w-[160px] flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
          >
            FDV
            {fdvSortOption === 'asc' ? (
              <TriangleDownSvg className="rotate-180" />
            ) : fdvSortOption === 'desc' ? (
              <TriangleDownSvg />
            ) : (
              <></>
            )}
          </button>
          <button
            onClick={() => {
              if (dailyChangeSortOption === 'none') {
                setDailyChangeSortOption('desc')
              } else if (dailyChangeSortOption === 'desc') {
                setDailyChangeSortOption('asc')
              } else {
                setDailyChangeSortOption('none')
              }
            }}
            className="w-[140px] flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
          >
            24h Change
            {dailyChangeSortOption === 'asc' ? (
              <TriangleDownSvg className="rotate-180" />
            ) : dailyChangeSortOption === 'desc' ? (
              <TriangleDownSvg />
            ) : (
              <></>
            )}
          </button>
          <button
            onClick={() => {
              if (verifiedSortOption === 'none') {
                setVerifiedSortOption('desc')
              } else if (verifiedSortOption === 'desc') {
                setVerifiedSortOption('asc')
              } else {
                setVerifiedSortOption('none')
              }
            }}
            className="flex items-center gap-1 text-sm font-semibold hover:underline cursor-pointer"
          >
            Verified
            {verifiedSortOption === 'asc' ? (
              <TriangleDownSvg className="rotate-180" />
            ) : verifiedSortOption === 'desc' ? (
              <TriangleDownSvg />
            ) : (
              <></>
            )}
          </button>
        </div>
        <div className="relative flex justify-center w-full h-full lg:h-[500px] mb-6">
          <div className="lg:absolute lg:top-0 lg:overflow-x-scroll w-full h-full items-center flex flex-1 flex-col md:grid md:grid-cols-2 lg:flex gap-3">
            {filteredMarkets.map((market) => {
              return (
                <MarketCard
                  key={`${market.baseCurrency.address}-${market.quoteCurrency.address}`}
                  chainId={selectedChain.id}
                  baseCurrency={market.baseCurrency}
                  quoteCurrency={market.quoteCurrency}
                  createAt={market.createAt}
                  price={market.price}
                  dailyVolume={market.dailyVolume}
                  fdv={market.fdv}
                  dailyChange={market.dailyChange}
                  verified={market.verified}
                  isBidTaken={market.isBidTaken}
                  isAskTaken={market.isAskTaken}
                />
              )
            })}

            {filteredMarkets.length === 0 && searchValue.length === 0 && (
              <div
                role="status"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-24 lg:mt-0"
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
    </div>
  )
}
