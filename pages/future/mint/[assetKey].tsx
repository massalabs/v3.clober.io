import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

import { ASSETS } from '../../../constants/future/asset'
import { useChainContext } from '../../../contexts/chain-context'
import { FutureManagerContainer } from '../../../containers/future/future-manager-container'
import { CurrencyIcon } from '../../../components/icon/currency-icon'
import BackSvg from '../../../components/svg/back-svg'
import { TradingViewContainer } from '../../../containers/chart/trading-view-container'

export default function MintFutureAssetManage() {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const asset = ASSETS[selectedChain.id]?.find(
    (asset) => asset.id.toLowerCase() === router.query.assetKey,
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
            href={`/future?chain=${selectedChain.id}`}
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
            <TradingViewContainer />
            <FutureManagerContainer asset={asset} />
          </div>
        </div>
      </main>
    </div>
  ) : (
    <></>
  )
}
