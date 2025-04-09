import React from 'react'
import { getAddress, zeroAddress } from 'viem'
import { useRouter } from 'next/router'

import { MarketCard } from '../components/card/market-card'
import { useChainContext } from '../contexts/chain-context'
import { SearchSvg } from '../components/svg/search-svg'

const baseCurrency = {
  symbol: 'ETH',
  name: 'ETH',
  address: zeroAddress,
  decimals: 18,
}
const quoteCurrency = {
  symbol: 'USDC',
  name: 'USD Coin',
  address: getAddress('0xf817257fed379853cDe0fa4F97AB987181B1E5Ea'),
  decimals: 6,
}

export const DiscoverContainer = () => {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const [searchValue, setSearchValue] = React.useState('')

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
          <div className="w-[220px] text-gray-400 text-sm font-semibold">
            Market
          </div>
          <div className="w-[210px] text-gray-400 text-sm font-semibold">
            Age
          </div>
          <div className="w-[145px] text-gray-400 text-sm font-semibold">
            Price
          </div>
          <div className="w-[160px] text-gray-400 text-sm font-semibold">
            24h Volume
          </div>
          <div className="w-[140px] text-gray-400 text-sm font-semibold">
            FDV
          </div>
          <div className="w-[120px] text-gray-400 text-sm font-semibold">
            24h Change
          </div>
          <div className="text-gray-400 text-sm font-semibold">Verified</div>
        </div>
        <div className="relative flex justify-center w-full h-full lg:h-[500px] mb-6">
          <div className="lg:absolute lg:top-0 lg:overflow-x-scroll w-full h-full items-center flex flex-1 flex-col md:grid md:grid-cols-2 lg:flex gap-3">
            {Array.from({ length: 20 }).map((_, index) => (
              <MarketCard
                key={index}
                chainId={selectedChain.id}
                baseCurrency={baseCurrency}
                quoteCurrency={quoteCurrency}
                createAt={1744005461}
                price={100000}
                dailyVolume={100000}
                fdv={100000}
                dailyChange={10}
                router={router}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
