import React, { useMemo } from 'react'
import { createPublicClient, http } from 'viem'
import { useRouter } from 'next/router'
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

export const DiscoverContainer = () => {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const { whitelistCurrencies, prices } = useCurrencyContext()
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: supportChains.find((chain) => chain.id === selectedChain.id),
      transport: http(RPC_URL[selectedChain.id]),
    })
  }, [selectedChain.id])

  const [searchValue, setSearchValue] = React.useState('')

  const { data: markets } = useQuery({
    queryKey: ['markets', selectedChain.id],
    queryFn: async () => {
      return fetchAllMarkets(
        publicClient,
        selectedChain,
        prices,
        whitelistCurrencies.map((currency) => currency.address),
      )
    },
    refetchInterval: 2 * 1000, // checked
    refetchIntervalInBackground: true,
  })

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
          <div className="w-[330px] text-gray-400 text-sm font-semibold">
            Market
          </div>
          <div className="w-[180px] text-gray-400 text-sm font-semibold">
            Age
          </div>
          <div className="w-[160px] text-gray-400 text-sm font-semibold">
            Price
          </div>
          <div className="flex flex-row gap-1 w-[160px] text-gray-400 text-sm font-semibold">
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
            </div>
          </div>
          <div className="w-[160px] text-gray-400 text-sm font-semibold">
            FDV
          </div>
          <div className="w-[140px] text-gray-400 text-sm font-semibold">
            24h Change
          </div>
          <div className="text-gray-400 text-sm font-semibold">Verified</div>
        </div>
        <div className="relative flex justify-center w-full h-full lg:h-[500px] mb-6">
          <div className="lg:absolute lg:top-0 lg:overflow-x-scroll w-full h-full items-center flex flex-1 flex-col md:grid md:grid-cols-2 lg:flex gap-3">
            {(markets ?? [])
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
              .sort((a, b) => b.liquidityUsd - a.liquidityUsd)
              .map((market) => {
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
                    router={router}
                  />
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
