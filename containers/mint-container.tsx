import React from 'react'
import { zeroAddress } from 'viem'
import { useRouter } from 'next/router'

import { Asset } from '../model/future/asset'
import { AssetCard } from '../components/card/asset-card'
import { useChainContext } from '../contexts/chain-context'

const assets: Asset[] = [
  {
    id: '0x',
    currency: {
      address: zeroAddress, // Todo: change to real address
      decimals: 18,
      name: 'AAPL',
      symbol: 'AAPL',
      icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-aapl-usd.inline.svg&w=1920&q=75',
    },
    priceFeedId:
      '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688',
    collateral: {
      address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
    },
    expiration: 1635724800, // todo: change to real expiration
    ltv: 700000n,
    liquidationThreshold: 800000n,
    ltvPrecision: 1000000n,
    minDebt: 10n * 10n ** 6n,
  },
]

export const MintContainer = () => {
  const { selectedChain } = useChainContext()
  const router = useRouter()

  return (
    <div className="w-full flex flex-col text-white mb-4">
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
              {assets.map((asset, index) => (
                <AssetCard
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
