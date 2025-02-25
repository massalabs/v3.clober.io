import React from 'react'
import { useRouter } from 'next/router'

import { FutureAssetCard } from '../../components/card/future-asset-card'
import { useChainContext } from '../../contexts/chain-context'
import { ASSETS } from '../../constants/future/asset'

export const FutureContainer = () => {
  const { selectedChain } = useChainContext()
  const router = useRouter()

  return (
    <div className="w-full flex flex-col text-white mt-8">
      <div className="flex justify-center w-auto sm:h-[160px]">
        <div className="w-[960px] mt-8 sm:mt-16 flex flex-col sm:gap-12 items-center">
          <div className="flex w-full flex-col justify-start items-center gap-2 sm:gap-3">
            <div className="self-stretch text-center text-white text-lg sm:text-4xl font-bold">
              Mint
            </div>
            <div className="self-stretch text-center text-gray-400 text-xs sm:text-sm font-bold">
              test test
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
