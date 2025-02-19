import React, { useState } from 'react'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { Market } from '@clober/v2-sdk'

import { useChainContext } from '../../contexts/chain-context'

const TVChartContainer = dynamic(
  () =>
    import('../trading-view-chart-container').then(
      (mod) => mod.TradingViewChartContainer,
    ),
  { ssr: false },
)

export const NativeChartContainer = ({
  selectedMarket,
  setShowOrderBook,
  totalSupply,
}: {
  selectedMarket: Market
  setShowOrderBook: (showOrderBook: boolean) => void
  totalSupply?: number
}) => {
  const { selectedChain } = useChainContext()
  const [isScriptReady, setIsScriptReady] = useState(false)

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady ? (
        <TVChartContainer
          chainId={selectedChain.id}
          market={selectedMarket}
          setShowOrderBook={setShowOrderBook}
          totalSupply={totalSupply}
        />
      ) : (
        <></>
      )}
    </>
  )
}
