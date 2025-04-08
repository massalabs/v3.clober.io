import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { isAddressEqual } from 'viem'

import { TRADING_VIEW_SYMBOLS } from '../../../constants/futures/asset'
import { useChainContext } from '../../../contexts/chain-context'
import { FuturesManagerContainer } from '../../../containers/futures/futures-manager-container'
import { CurrencyIcon } from '../../../components/icon/currency-icon'
import BackSvg from '../../../components/svg/back-svg'
import { TradingViewContainer } from '../../../containers/chart/trading-view-container'
import { useFuturesContext } from '../../../contexts/futures/futures-context'

export default function MintFutureAssetManage() {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const { assets } = useFuturesContext()
  const asset = assets?.find(
    (asset) =>
      router.query.assetKey &&
      isAddressEqual(asset.id, router.query.assetKey as `0x${string}`),
  )

  return router.query.assetKey && asset ? (
    <div className="flex flex-1 w-full">
      <Head>
        <title>Mint {asset.currency.symbol}</title>
      </Head>

      <main className="flex flex-1 flex-col justify-center items-center">
        <div className="flex flex-1 flex-col w-full gap-6">
          <Link
            className="flex items-center font-bold text-base sm:text-2xl gap-2 sm:gap-3 mt-4 mb-2 sm:mb-2 ml-4 sm:ml-6"
            replace={true}
            href={`/futures?chain=${selectedChain.id}`}
          >
            <BackSvg className="w-4 h-4 sm:w-8 sm:h-8" />
            <div className="flex gap-2">
              Short
              <CurrencyIcon
                currency={asset.currency}
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              {asset.currency.symbol}
            </div>
          </Link>
          <div className="flex flex-col lg:flex-row sm:items-center lg:items-start justify-center gap-4 mb-4 px-2 md:px-0">
            <TradingViewContainer
              symbol={TRADING_VIEW_SYMBOLS[asset.currency.priceFeedId]}
            />
            <FuturesManagerContainer asset={asset} />
          </div>
        </div>
      </main>
    </div>
  ) : (
    <></>
  )
}
