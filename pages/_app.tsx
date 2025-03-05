import React, { useCallback, useEffect, useState } from 'react'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { WagmiProvider } from 'wagmi'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getSubgraphBlockNumber } from '@clober/v2-sdk'
import { http } from 'viem'

import HeaderContainer from '../containers/header-container'
import { ChainProvider, useChainContext } from '../contexts/chain-context'
import { MarketProvider } from '../contexts/trade/market-context'
import { supportChains } from '../constants/chain'
import { TransactionProvider } from '../contexts/transaction-context'
import { OpenOrderProvider } from '../contexts/trade/open-order-context'
import { LimitContractProvider } from '../contexts/trade/limit-contract-context'
import Panel from '../components/panel'
import ErrorBoundary from '../components/error-boundary'
import { CurrencyProvider } from '../contexts/currency-context'
import Footer from '../components/footer'
import { TradeProvider } from '../contexts/trade/trade-context'
import { SwapContractProvider } from '../contexts/trade/swap-contract-context'
import { VaultProvider } from '../contexts/vault/vault-context'
import { VaultContractProvider } from '../contexts/vault/vault-contract-context'
import { RPC_URL } from '../constants/rpc-urls'
import { FutureProvider } from '../contexts/future/future-context'
import { FutureContractProvider } from '../contexts/future/future-contract-context'

const config = getDefaultConfig({
  appName: 'Clober',
  projectId: '14e09398dd595b0d1dccabf414ac4531',
  chains: supportChains as any,
  transports: Object.fromEntries(
    supportChains.map((chain) => [chain.id, http(RPC_URL[chain.id])]),
  ),
})

const CacheProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    localStorage.removeItem('wagmi.cache')
  }, [queryClient])

  return <>{children}</>
}

const queryClient = new QueryClient()
const WalletProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <CacheProvider>{children}</CacheProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const TradeProvidersWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <OpenOrderProvider>
      <LimitContractProvider>
        <SwapContractProvider>
          <TradeProvider>
            <MarketProvider>{children}</MarketProvider>
          </TradeProvider>
        </SwapContractProvider>
      </LimitContractProvider>
    </OpenOrderProvider>
  )
}

const VaultProvidersWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <VaultProvider>
      <VaultContractProvider>{children}</VaultContractProvider>
    </VaultProvider>
  )
}

const FutureProvidersWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <FutureProvider>
      <FutureContractProvider>{children}</FutureContractProvider>
    </FutureProvider>
  )
}

const PanelWrapper = ({
  open,
  setOpen,
  children,
}: {
  open: boolean
  setOpen: (open: boolean) => void
} & React.PropsWithChildren) => {
  const router = useRouter()
  const { selectedChain } = useChainContext()

  return (
    <Panel
      chainId={selectedChain.id}
      open={open}
      setOpen={setOpen}
      router={router}
    >
      {children}
    </Panel>
  )
}

const FooterWrapper = () => {
  const { selectedChain } = useChainContext()
  const queryClient = useQueryClient()
  const { data: latestSubgraphBlockNumber } = useQuery({
    queryKey: ['latest-subgraph-block-number', selectedChain.id],
    queryFn: async () => {
      console.log({
        queryKeys: queryClient
          .getQueryCache()
          .getAll()
          .map((query) => query.queryKey),
      })
      return getSubgraphBlockNumber({ chainId: selectedChain.id })
    },
    initialData: 0,
    refetchInterval: 4 * 1000, // checked
    refetchIntervalInBackground: true,
  })

  return <Footer latestSubgraphBlockNumber={latestSubgraphBlockNumber} />
}

function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const router = useRouter()

  const handlePopState = useCallback(async () => {
    if (history.length > 1) {
      setHistory((previous) => previous.slice(0, previous.length - 1))
      router.push(history[history.length - 2])
    }
  }, [history, router])

  useEffect(() => {
    setHistory((previous) => [...previous, router.asPath])
  }, [router.asPath])

  useEffect(() => {
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [handlePopState])

  return (
    <>
      <ErrorBoundary>
        <Head>
          <title>Clober | Fully On-chain Order Book</title>
          <link rel="apple-touch-icon" href="/favicon.png" />
          <link rel="icon" type="image/png" href="/favicon.png" />
        </Head>
        <WalletProvider>
          <TransactionProvider>
            <ChainProvider>
              <CurrencyProvider>
                <div
                  className={`flex flex-col w-[100vw] min-h-[100vh] bg-[#0F1013] text-white bg-right`}
                >
                  <PanelWrapper open={open} setOpen={setOpen} />
                  <HeaderContainer onMenuClick={() => setOpen(true)} />

                  {router.pathname.includes('/trade') ? (
                    <TradeProvidersWrapper>
                      <div className="flex flex-1 relative justify-center">
                        <div className="flex w-full flex-col items-center gap-6 md:gap-11 px-2 pb-0 mt-[30px] md:mt-[56px]">
                          <Component {...pageProps} />
                        </div>
                      </div>
                    </TradeProvidersWrapper>
                  ) : router.pathname.includes('/earn') ? (
                    <VaultProvidersWrapper>
                      <div className="flex flex-1 relative justify-center">
                        <div className="flex w-full flex-col items-center gap-6 md:gap-11 px-2 pb-0">
                          <Component {...pageProps} />
                        </div>
                      </div>
                    </VaultProvidersWrapper>
                  ) : window.location.href.includes('futures.clober.io') ||
                    router.pathname.includes('/future') ? (
                    <FutureProvidersWrapper>
                      <div className="flex flex-1 relative justify-center">
                        <div className="flex w-full flex-col items-center gap-6 md:gap-11 px-2 pb-0">
                          <Component {...pageProps} />
                        </div>
                      </div>
                    </FutureProvidersWrapper>
                  ) : (
                    <TradeProvidersWrapper>
                      <div className="flex flex-1 relative justify-center">
                        <div className="flex w-full flex-col items-center gap-6 md:gap-11 px-2 pb-0 mt-[30px] md:mt-[56px]">
                          <Component {...pageProps} />
                        </div>
                      </div>
                    </TradeProvidersWrapper>
                  )}

                  <FooterWrapper />
                </div>
              </CurrencyProvider>
            </ChainProvider>
          </TransactionProvider>
        </WalletProvider>
      </ErrorBoundary>
    </>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
