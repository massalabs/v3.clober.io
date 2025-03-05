import React, { useEffect, useRef } from 'react'

const TradingViewWidget = ({ symbol }: { symbol: string }) => {
  // @ts-ignore
  const ref = useRef<any>()

  useEffect(() => {
    if (ref.current.children.length > 0) {
      ref.current.removeChild(ref.current.children[0])
    }
    if (ref.current.children.length === 0) {
      const script = document.createElement('script')
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
      script.type = 'text/javascript'
      script.async = true
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "${symbol}",
          "interval": "15",
          "theme": "dark",
          "style": "1",
          "locale": "ko",
          "enable_publishing": false,
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`
      ref.current.appendChild(script)
    }
  }, [symbol])

  return (
    <div className="hidden lg:flex flex-col bg-transparent overflow-hidden 'rounded-2xl min-h-[280px] h-full lg:h-[600px] lg:w-[600px]">
      <div className="flex flex-col flex-1 [&>iframe]:flex-1" ref={ref} />
    </div>
  )
}

export const TradingViewContainer = ({ symbol }: { symbol: string }) => {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-[19px] self-stretch">
      <TradingViewWidget symbol={symbol} />
    </div>
  )
}
