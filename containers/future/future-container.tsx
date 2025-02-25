import React from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { FutureAssetCard } from '../../components/card/future-asset-card'
import { useChainContext } from '../../contexts/chain-context'
import { ASSETS } from '../../constants/future/asset'

export const FutureContainer = () => {
  const { selectedChain } = useChainContext()
  const router = useRouter()
  const { address: userAddress } = useAccount()

  const [tab, setTab] = React.useState<'my-position' | 'mint'>('mint')

  return (
    <div className="w-full flex flex-col text-white mt-8">
      <div className="flex justify-center w-auto sm:h-[240px]">
        <div className="w-[960px] mt-8 sm:mt-16 flex flex-col sm:gap-12 items-center">
          <div className="flex w-full flex-col justify-start items-center gap-2 sm:gap-3">
            <div className="self-stretch text-center text-white text-lg sm:text-4xl font-bold">
              Mint
            </div>
            <div className="self-stretch text-center text-gray-400 text-xs sm:text-sm font-bold">
              test test
            </div>
          </div>

          <div className="flex w-full mt-8 sm:mt-0 sm:mr-auto px-4">
            <div className="w-full sm:w-[328px] h-[40px] sm:h-[56px] items-center flex">
              <button
                onClick={() => setTab('mint')}
                disabled={tab === 'mint'}
                className="flex flex-1 gap-2 items-center justify-center w-full h-full text-gray-500 disabled:text-white disabled:bg-gray-800 bg-transparent rounded-tl-2xl rounded-tr-2xl"
              >
                <div className="text-center text-sm sm:text-base font-bold">
                  Mint
                </div>
              </button>
              <button
                onClick={() => userAddress && setTab('my-position')}
                disabled={tab === 'my-position'}
                className="flex flex-1 gap-2 items-center justify-center w-full h-full text-gray-500 disabled:text-white disabled:bg-gray-800 bg-transparent rounded-tl-2xl rounded-tr-2xl"
              >
                <div className="text-center text-sm sm:text-base font-bold">
                  My Position
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-auto flex-col items-center mt-6 lg:mt-12 px-4 lg:px-0">
        <div className="flex flex-col w-full lg:w-[960px] h-full gap-6">
          <div className="hidden lg:flex self-stretch px-4 justify-start items-center gap-4">
            <div className="w-36 text-gray-400 text-sm font-semibold">
              Asset
            </div>
            <div className="w-36 text-gray-400 text-sm font-semibold">
              Collateral
            </div>
            <div className="w-[140px] text-gray-400 text-sm font-semibold">
              Max LTV
            </div>
            <div className="w-[140px] text-gray-400 text-sm font-semibold">
              Expired Date
            </div>
          </div>
          <div className="relative flex justify-center w-full h-full lg:h-[360px]">
            <div className="lg:absolute lg:top-0 lg:overflow-x-scroll w-full h-full items-center flex flex-1 flex-col md:grid md:grid-cols-2 lg:flex gap-3">
              {(ASSETS[selectedChain.id] ?? []).map((asset, index) => (
                <FutureAssetCard
                  chainId={selectedChain.id}
                  key={index}
                  asset={asset}
                  router={router}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
