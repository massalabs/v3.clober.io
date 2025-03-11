import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isAddressEqual, parseUnits, zeroAddress } from 'viem'
import { useAccount, useGasPrice, useWalletClient } from 'wagmi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMarketId, getQuoteToken } from '@clober/v2-sdk'
import BigNumber from 'bignumber.js'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'

import { LimitForm } from '../components/form/limit-form'
import OrderBook from '../components/order-book'
import { useChainContext } from '../contexts/chain-context'
import { useMarketContext } from '../contexts/trade/market-context'
import { useOpenOrderContext } from '../contexts/trade/open-order-context'
import { useLimitContractContext } from '../contexts/trade/limit-contract-context'
import { useCurrencyContext } from '../contexts/currency-context'
import { isAddressesEqual } from '../utils/address'
import { fetchQuotes } from '../apis/swap/quotes'
import { AGGREGATORS } from '../constants/aggregators'
import { formatUnits } from '../utils/bigint'
import { toPlacesString } from '../utils/bignumber'
import { MarketInfoCard } from '../components/card/market-info-card'
import { OpenOrderCardList } from '../components/card/open-order-card-list'
import { ActionButton } from '../components/button/action-button'
import { Currency } from '../model/currency'
import { testnetChainIds } from '../constants/chain'
import WarningLimitModal from '../components/modal/warning-limit-modal'
import { useTradeContext } from '../contexts/trade/trade-context'
import { SwapForm } from '../components/form/swap-form'
import { useSwapContractContext } from '../contexts/trade/swap-contract-context'
import { fetchTokenInfo } from '../apis/dexscreener'
import { DEFAULT_TOKEN_INFO } from '../model/token-info'
import { WETH } from '../constants/currency'
import { fetchPrice } from '../apis/price'
import { fetchTokenInfoFromOrderBook } from '../apis/token'

import { IframeChartContainer } from './chart/iframe-chart-container'
import { NativeChartContainer } from './chart/native-chart-container'

export const TradeContainer = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: gasPrice } = useGasPrice()
  const { selectedChain } = useChainContext()
  const {
    selectedMarket,
    availableDecimalPlacesGroups,
    selectedDecimalPlaces,
    setSelectedDecimalPlaces,
    bids,
    asks,
    setDepthClickedIndex,
  } = useMarketContext()
  const { openOrders } = useOpenOrderContext()
  const { limit, cancels, claims } = useLimitContractContext()
  const { swap } = useSwapContractContext()
  const { address: userAddress } = useAccount()
  const { data: walletClient } = useWalletClient()
  const {
    isBid,
    setIsBid,
    showInputCurrencySelect,
    setShowInputCurrencySelect,
    inputCurrency,
    setInputCurrency,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    showOutputCurrencySelect,
    setShowOutputCurrencySelect,
    outputCurrency,
    setOutputCurrency,
    outputCurrencyAmount,
    setOutputCurrencyAmount,
    isPostOnly,
    setIsPostOnly,
    priceInput,
    setPriceInput,
    slippageInput,
    setSlippageInput,
  } = useTradeContext()
  const { openConnectModal } = useConnectModal()
  const { balances, prices, currencies, setCurrencies } = useCurrencyContext()
  const [showOrderBook, setShowOrderBook] = useState(false)
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [marketPrice, setMarketPrice] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [latestRefreshTime, setLatestRefreshTime] = useState(Date.now())

  const [debouncedValue, setDebouncedValue] = useState('')
  const [tab, setTab] = useState<'limit' | 'swap'>('swap')
  const previousChain = useRef({
    chain: selectedChain,
  })

  const marketId = selectedMarket
    ? getMarketId(selectedChain.id, [
        selectedMarket.base.address,
        selectedMarket.quote.address,
      ]).marketId
    : ''
  const { data: tokenInfo } = useQuery({
    queryKey: [
      'token-info',
      selectedChain,
      marketId,
      selectedMarket ? (prices[selectedMarket.quote.address] ?? 0) : 0,
    ],
    queryFn: async () => {
      if (!selectedMarket) {
        return DEFAULT_TOKEN_INFO
      }
      const queryKeys = queryClient
        .getQueryCache()
        .getAll()
        .map((query) => query.queryKey)
        .filter((key) => key[0] === 'token-info')
      for (const key of queryKeys) {
        if (key[2] && key[2] !== marketId) {
          queryClient.removeQueries({ queryKey: key })
        }
      }
      if (testnetChainIds.includes(selectedChain.id)) {
        return fetchTokenInfoFromOrderBook(
          selectedChain.id,
          selectedMarket,
          prices[selectedMarket.quote.address] ?? 0,
        )
      }
      const tokenInfo = await fetchTokenInfo({
        chainId: selectedChain.id,
        base: selectedMarket.base.address,
        quote: selectedMarket.quote.address,
      })
      if (tokenInfo) {
        return tokenInfo
      } else {
        return fetchTokenInfoFromOrderBook(
          selectedChain.id,
          selectedMarket,
          prices[selectedMarket.quote.address] ?? 0,
        )
      }
    },
    refetchInterval: 2000, // checked
    refetchIntervalInBackground: true,
  })

  const [quoteCurrency, baseCurrency] = useMemo(() => {
    if (inputCurrency && outputCurrency) {
      const quote = getQuoteToken({
        chainId: selectedChain.id,
        token0: inputCurrency.address,
        token1: outputCurrency.address,
      })
      return isAddressEqual(quote, inputCurrency.address)
        ? [inputCurrency, outputCurrency]
        : [outputCurrency, inputCurrency]
    } else {
      return [undefined, undefined]
    }
  }, [inputCurrency, outputCurrency, selectedChain.id])

  const amount = useMemo(
    () => parseUnits(inputCurrencyAmount, inputCurrency?.decimals ?? 18),
    [inputCurrency?.decimals, inputCurrencyAmount],
  )

  const claimableOpenOrders = openOrders.filter(
    ({ claimable }) =>
      parseUnits(claimable.value, claimable.currency.decimals) > 0n,
  )
  const cancellableOpenOrders = openOrders.filter(
    ({ cancelable }) =>
      parseUnits(cancelable.value, cancelable.currency.decimals) > 0n,
  )

  useEffect(() => {
    if (
      selectedMarket &&
      selectedMarket.asks.length + selectedMarket.bids.length === 0
    ) {
      setShowOrderBook(false)
    }
  }, [selectedMarket])

  // once
  useEffect(
    () => {
      const action = async () => {
        setIsFetchingQuotes(true)
        previousChain.current.chain = selectedChain
        if (inputCurrency && outputCurrency) {
          try {
            const price = await fetchPrice(
              selectedChain.id,
              inputCurrency,
              outputCurrency,
            )
            if (
              previousChain.current.chain.id !== selectedChain.id ||
              price.isZero()
            ) {
              return
            }
            console.log({
              context: 'limit',
              price: price.toNumber(),
              chainId: selectedChain.id,
              inputCurrency: inputCurrency.symbol,
              outputCurrency: outputCurrency.symbol,
            })
            setMarketPrice(price.toNumber())
            setPriceInput(price.toNumber().toString())
          } catch (e) {
            console.error(`Failed to fetch price: ${e}`)
          } finally {
            setIsFetchingQuotes(false)
          }
        }
      }

      setDepthClickedIndex(undefined)
      setPriceInput('')
      setMarketPrice(0)

      action()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputCurrency, outputCurrency, selectedChain.id],
  )

  const setMarketRateAction = useCallback(async () => {
    if (inputCurrency && outputCurrency) {
      setIsFetchingQuotes(true)
      const price = await fetchPrice(
        selectedChain.id,
        inputCurrency,
        outputCurrency,
      )
      const minimumDecimalPlaces = availableDecimalPlacesGroups?.[0]?.value
      if (
        previousChain.current.chain.id !== selectedChain.id ||
        price.isZero()
      ) {
        return
      }
      setPriceInput(
        minimumDecimalPlaces
          ? toPlacesString(price, minimumDecimalPlaces)
          : price.toFixed(),
      )
      setIsFetchingQuotes(false)
    }
  }, [
    availableDecimalPlacesGroups,
    inputCurrency,
    outputCurrency,
    selectedChain.id,
    setPriceInput,
  ])

  const marketRateDiff = (
    isBid
      ? new BigNumber(marketPrice).dividedBy(priceInput).minus(1).times(100)
      : new BigNumber(priceInput).dividedBy(marketPrice).minus(1).times(100)
  ).toNumber()

  const amountIn = parseUnits(
    inputCurrencyAmount,
    inputCurrency?.decimals ?? 18,
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputCurrencyAmount)
    }, 500)

    return () => clearTimeout(timer)
  }, [inputCurrencyAmount])

  const { data: quotes } = useQuery({
    queryKey: [
      'quotes',
      inputCurrency,
      outputCurrency,
      Number(inputCurrencyAmount),
      slippageInput,
      userAddress,
      selectedChain,
      tab,
      latestRefreshTime,
      debouncedValue,
    ],
    queryFn: async () => {
      if (
        gasPrice &&
        inputCurrency &&
        outputCurrency &&
        amountIn > 0n &&
        tab === 'swap' &&
        Number(debouncedValue) === Number(inputCurrencyAmount)
      ) {
        console.log({
          context: 'quote',
          chainId: selectedChain.id,
          inputCurrency: inputCurrency.symbol,
          outputCurrency: outputCurrency.symbol,
          amountIn,
        })
        return fetchQuotes(
          AGGREGATORS[selectedChain.id],
          inputCurrency,
          amountIn,
          outputCurrency,
          parseFloat(slippageInput),
          gasPrice,
          userAddress,
        )
      }
      return null
    },
  })
  const priceImpact = useMemo(() => {
    if (quotes && quotes.priceImpact) {
      return quotes.priceImpact
    }
    if (
      quotes &&
      quotes.amountIn > 0n &&
      quotes.amountOut > 0n &&
      inputCurrency &&
      outputCurrency &&
      prices[inputCurrency.address] &&
      prices[outputCurrency.address]
    ) {
      const amountIn = Number(
        formatUnits(quotes.amountIn, inputCurrency.decimals),
      )
      const amountOut = Number(
        formatUnits(quotes.amountOut, outputCurrency.decimals),
      )
      const inputValue = amountIn * prices[inputCurrency.address]
      const outputValue = amountOut * prices[outputCurrency.address]
      return inputValue > outputValue
        ? ((outputValue - inputValue) / inputValue) * 100
        : 0
    }
    return Number.NaN
  }, [inputCurrency, outputCurrency, prices, quotes])

  return (
    <>
      {showWarningModal ? (
        <WarningLimitModal
          marketPrice={marketPrice}
          priceInput={Number(priceInput)}
          marketRateDiff={marketRateDiff}
          closeModal={() => setShowWarningModal(false)}
          limit={async () => {
            if (!inputCurrency || !outputCurrency || !selectedMarket) {
              return
            }
            setShowWarningModal(false)
            await limit(
              inputCurrency,
              outputCurrency,
              inputCurrencyAmount,
              priceInput,
              isPostOnly,
              selectedMarket,
            )
          }}
        />
      ) : (
        <></>
      )}

      <div className="bg-[#191d25] rounded-[22px] py-1 w-full h-10 flex sm:hidden flex-row relative text-gray-400 text-base font-bold">
        <button
          disabled={tab === 'swap'}
          onClick={() => setTab('swap')}
          className="text-sm flex flex-1 px-6 py-1.5 h-full rounded-[20px] text-gray-400 disabled:text-blue-400 disabled:bg-blue-500/25 justify-center items-center gap-1"
        >
          Swap
        </button>
        <button
          disabled={tab === 'limit'}
          onClick={() => setTab('limit')}
          className="text-sm flex flex-1 px-6 py-1.5 h-full rounded-[20px] text-gray-400 disabled:text-blue-400 disabled:bg-blue-500/25 justify-center items-center gap-1"
        >
          Limit
        </button>
      </div>

      <div className="flex flex-col w-full sm:w-fit mb-4 sm:mb-6">
        <div className="flex flex-col w-full lg:flex-row gap-4">
          <div className="flex flex-col gap-[26px] sm:gap-4 w-full lg:w-[740px]">
            {baseCurrency && quoteCurrency ? (
              <>
                <MarketInfoCard
                  baseCurrency={
                    {
                      ...baseCurrency,
                      icon: currencies.find((c) =>
                        isAddressEqual(c.address, baseCurrency.address),
                      )?.icon,
                    } as Currency
                  }
                  quoteCurrency={
                    {
                      ...quoteCurrency,
                      icon: currencies.find((c) =>
                        isAddressEqual(c.address, quoteCurrency.address),
                      )?.icon,
                    } as Currency
                  }
                  price={tokenInfo?.priceNative ?? 0}
                  dollarValue={tokenInfo?.priceUsd ?? 0}
                  fdv={tokenInfo?.fdv ?? 0}
                  marketCap={tokenInfo?.marketCap ?? 0}
                  dailyVolume={tokenInfo?.volume?.h24 ?? 0}
                  liquidityUsd={tokenInfo?.liquidity?.usd ?? 0}
                  websiteUrl={tokenInfo?.info?.website ?? ''}
                  twitterUrl={tokenInfo?.info?.twitter ?? ''}
                  telegramUrl={tokenInfo?.info?.telegram ?? ''}
                />
              </>
            ) : (
              <></>
            )}

            <div className="flex flex-col h-full rounded-xl sm:rounded-2xl bg-[#171b24]">
              <div className="flex lg:hidden w-full h-10">
                <button
                  disabled={showOrderBook}
                  onClick={() => setShowOrderBook(true)}
                  className="flex-1 h-full px-6 py-2.5 text-gray-500 disabled:text-blue-500 disabled:border-b-2 disabled:border-solid disabled:border-b-blue-500 justify-center items-center gap-1 inline-flex"
                >
                  <div className="text-[13px] font-semibold">Order Book</div>
                </button>
                <button
                  disabled={!showOrderBook}
                  onClick={() => setShowOrderBook(false)}
                  className="flex-1 h-full px-6 py-2.5 text-gray-500 disabled:text-blue-500 disabled:border-b-2 disabled:border-solid disabled:border-b-blue-500 justify-center items-center gap-1 inline-flex"
                >
                  <div className="text-[13px] font-semibold">Chart</div>
                </button>
              </div>

              {!showOrderBook && baseCurrency ? (
                !testnetChainIds.includes(selectedChain.id) ? (
                  <IframeChartContainer
                    setShowOrderBook={setShowOrderBook}
                    baseCurrency={
                      isAddressEqual(zeroAddress, baseCurrency.address)
                        ? WETH[selectedChain.id]
                        : baseCurrency
                    }
                    chainName={selectedChain.name.toLowerCase()}
                  />
                ) : (
                  <NativeChartContainer
                    baseCurrency={baseCurrency}
                    quoteCurrency={quoteCurrency}
                    setShowOrderBook={setShowOrderBook}
                  />
                )
              ) : (
                <></>
              )}

              {showOrderBook ? (
                <OrderBook
                  bids={bids}
                  asks={asks}
                  availableDecimalPlacesGroups={
                    availableDecimalPlacesGroups ?? []
                  }
                  selectedDecimalPlaces={selectedDecimalPlaces}
                  setSelectedDecimalPlaces={setSelectedDecimalPlaces}
                  setDepthClickedIndex={setDepthClickedIndex}
                  setShowOrderBook={setShowOrderBook}
                  setTab={setTab}
                  className="flex flex-col px-0.5 lg:px-4 pb-4 pt-2 sm:pb-6 bg-[#171b24] rounded-b-xl sm:rounded-2xl gap-[20px] h-[300px] lg:h-full w-full"
                />
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3">
            <div className="bg-[#191d25] rounded-[22px] py-1 w-full h-10 hidden sm:flex flex-row relative text-gray-400 text-base font-bold">
              <button
                disabled={tab === 'swap'}
                onClick={() => setTab('swap')}
                className="flex flex-1 px-6 py-2 rounded-[18px] text-gray-400 disabled:text-blue-400 disabled:bg-blue-500/25 justify-center items-center gap-1"
              >
                Swap
              </button>
              <button
                disabled={tab === 'limit'}
                onClick={() => setTab('limit')}
                className="flex flex-1 px-6 py-2 rounded-[18px] text-gray-400 disabled:text-blue-400 disabled:bg-blue-500/25 justify-center items-center gap-1"
              >
                Limit
              </button>
            </div>
            <div className="hidden sm:flex flex-col rounded-2xl bg-[#171b24] p-6 w-full sm:w-[480px] h-[616px]">
              {tab === 'limit' ? (
                <LimitForm
                  chainId={selectedChain.id}
                  prices={prices}
                  balances={balances}
                  currencies={currencies}
                  setCurrencies={setCurrencies}
                  priceInput={priceInput}
                  setPriceInput={setPriceInput}
                  selectedMarket={selectedMarket}
                  isBid={isBid}
                  isPostOnly={isPostOnly}
                  setIsPostOnly={setIsPostOnly}
                  showInputCurrencySelect={showInputCurrencySelect}
                  setShowInputCurrencySelect={setShowInputCurrencySelect}
                  inputCurrency={inputCurrency}
                  setInputCurrency={setInputCurrency}
                  inputCurrencyAmount={inputCurrencyAmount}
                  setInputCurrencyAmount={setInputCurrencyAmount}
                  availableInputCurrencyBalance={
                    inputCurrency ? (balances[inputCurrency.address] ?? 0n) : 0n
                  }
                  showOutputCurrencySelect={showOutputCurrencySelect}
                  setShowOutputCurrencySelect={setShowOutputCurrencySelect}
                  outputCurrency={outputCurrency}
                  setOutputCurrency={setOutputCurrency}
                  outputCurrencyAmount={outputCurrencyAmount}
                  setOutputCurrencyAmount={setOutputCurrencyAmount}
                  availableOutputCurrencyBalance={
                    outputCurrency
                      ? (balances[outputCurrency.address] ?? 0n)
                      : 0n
                  }
                  swapInputCurrencyAndOutputCurrency={() => {
                    setIsBid((prevState) => !prevState)
                    setDepthClickedIndex(undefined)
                    setInputCurrencyAmount(outputCurrencyAmount)

                    // swap currencies
                    const _inputCurrency = inputCurrency
                    setInputCurrency(outputCurrency)
                    setOutputCurrency(_inputCurrency)
                  }}
                  minimumDecimalPlaces={
                    availableDecimalPlacesGroups?.[0]?.value
                  }
                  marketPrice={marketPrice}
                  marketRateDiff={marketRateDiff}
                  setMarketRateAction={{
                    isLoading: isFetchingQuotes,
                    action: async () => {
                      await setMarketRateAction()
                    },
                  }}
                  closeLimitFormAction={() => setShowMobileModal(false)}
                  actionButtonProps={{
                    disabled:
                      !!walletClient &&
                      (!inputCurrency ||
                        !outputCurrency ||
                        priceInput === '' ||
                        (selectedMarket &&
                          !isAddressesEqual(
                            [inputCurrency.address, outputCurrency.address],
                            [
                              selectedMarket.base.address,
                              selectedMarket.quote.address,
                            ],
                          )) ||
                        amount === 0n ||
                        amount > (balances[inputCurrency.address] ?? 0n)),
                    onClick: async () => {
                      if (!walletClient && openConnectModal) {
                        openConnectModal()
                      }
                      if (
                        !inputCurrency ||
                        !outputCurrency ||
                        !selectedMarket
                      ) {
                        return
                      }
                      if (marketRateDiff < -2) {
                        setShowWarningModal(true)
                        return
                      }
                      await limit(
                        inputCurrency,
                        outputCurrency,
                        inputCurrencyAmount,
                        priceInput,
                        isPostOnly,
                        selectedMarket,
                      )
                    },
                    text: !walletClient
                      ? 'Connect wallet'
                      : !inputCurrency
                        ? 'Select input currency'
                        : !outputCurrency
                          ? 'Select output currency'
                          : amount === 0n
                            ? 'Enter amount'
                            : amount > balances[inputCurrency.address]
                              ? 'Insufficient balance'
                              : `Place Order`,
                  }}
                />
              ) : (
                <SwapForm
                  chainId={selectedChain.id}
                  currencies={currencies}
                  setCurrencies={setCurrencies}
                  balances={balances}
                  prices={prices}
                  showInputCurrencySelect={showInputCurrencySelect}
                  setShowInputCurrencySelect={setShowInputCurrencySelect}
                  inputCurrency={inputCurrency}
                  setInputCurrency={setInputCurrency}
                  inputCurrencyAmount={inputCurrencyAmount}
                  setInputCurrencyAmount={setInputCurrencyAmount}
                  availableInputCurrencyBalance={
                    inputCurrency ? (balances[inputCurrency.address] ?? 0n) : 0n
                  }
                  showOutputCurrencySelect={showOutputCurrencySelect}
                  setShowOutputCurrencySelect={setShowOutputCurrencySelect}
                  outputCurrency={outputCurrency}
                  setOutputCurrency={setOutputCurrency}
                  outputCurrencyAmount={formatUnits(
                    quotes?.amountOut ?? 0n,
                    outputCurrency?.decimals ?? 18,
                  )}
                  slippageInput={slippageInput}
                  setSlippageInput={setSlippageInput}
                  aggregatorName={quotes?.aggregator?.name ?? ''}
                  gasEstimateValue={
                    parseFloat(
                      formatUnits(
                        BigInt(quotes?.gasLimit ?? 0n) * (gasPrice ?? 0n),
                        selectedChain.nativeCurrency.decimals,
                      ),
                    ) * (prices[zeroAddress] ?? 0)
                  }
                  priceImpact={priceImpact}
                  refreshQuotesAction={() => setLatestRefreshTime(Date.now())}
                  closeSwapFormAction={() => setShowMobileModal(false)}
                  actionButtonProps={{
                    disabled:
                      (Number(inputCurrencyAmount) > 0 &&
                        (quotes?.amountOut ?? 0n) === 0n) ||
                      !walletClient ||
                      !inputCurrency ||
                      !outputCurrency ||
                      amount === 0n ||
                      amount > balances[inputCurrency.address],
                    onClick: async () => {
                      if (!userAddress && openConnectModal) {
                        openConnectModal()
                      }

                      if (
                        !gasPrice ||
                        !userAddress ||
                        !inputCurrency ||
                        !outputCurrency ||
                        !inputCurrencyAmount ||
                        !quotes ||
                        amountIn !== quotes.amountIn
                      ) {
                        return
                      }
                      await swap(
                        inputCurrency,
                        amountIn,
                        outputCurrency,
                        quotes.amountOut,
                        parseFloat(slippageInput),
                        gasPrice,
                        userAddress,
                        AGGREGATORS[selectedChain.id].find(
                          (aggregator) =>
                            aggregator.name === quotes.aggregator.name,
                        )!,
                      )
                    },
                    text:
                      Number(inputCurrencyAmount) > 0 &&
                      (quotes?.amountOut ?? 0n) === 0n
                        ? 'Fetching...'
                        : !walletClient
                          ? 'Connect wallet'
                          : !inputCurrency
                            ? 'Select input currency'
                            : !outputCurrency
                              ? 'Select output currency'
                              : amount === 0n
                                ? 'Enter amount'
                                : amount > balances[inputCurrency.address]
                                  ? 'Insufficient balance'
                                  : isAddressEqual(
                                        inputCurrency.address,
                                        zeroAddress,
                                      ) &&
                                      isAddressEqual(
                                        outputCurrency.address,
                                        WETH[selectedChain.id].address,
                                      )
                                    ? 'Wrap'
                                    : isAddressEqual(
                                          inputCurrency.address,
                                          WETH[selectedChain.id].address,
                                        ) &&
                                        isAddressEqual(
                                          outputCurrency.address,
                                          zeroAddress,
                                        )
                                      ? 'Unwrap'
                                      : `Swap`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {userAddress ? (
          <>
            <div className="flex mt-[20px] mb-4 lg:mt-12 text-white">
              <div className="border-b-blue-500 text-[13px] lg:text-base border-solid lg:border-0 flex w-1/2 lg:w-[161px] h-[37px] px-6 lg:px-0 lg:justify-start pt-1.5 pb-2.5 border-b-2 border-[#ffc32d] justify-center items-center gap-2">
                <div className="text-white font-semibold">Open Order</div>
                <div className="flex px-2 py-0.5 lg:h-7 lg:px-2.5 lg:py-0.5 bg-blue-500/20 rounded-[17.02px] flex-col justify-center items-center">
                  <div className="text-blue-500 text-[13px] font-semibold">
                    {openOrders.length}
                  </div>
                </div>
              </div>
            </div>

            {/*pc open order card*/}
            {openOrders.length > 0 ? (
              <div className="hidden lg:flex flex-col justify-start items-center gap-4 bg-transparent mb-14">
                <div className="w-full justify-start items-end inline-flex">
                  <div className="flex text-gray-500 text-xs font-semibold">
                    <div className="flex w-[180px] ml-5">Market</div>
                    <div className="flex w-[130px]">Price</div>
                    <div className="flex w-[170px]">Amount</div>
                    <div className="flex w-[175px]">Filled</div>
                    <div className="flex w-[150px]">Claimable</div>
                  </div>
                  <div className="h-full ml-auto justify-center items-center gap-3 flex">
                    <ActionButton
                      disabled={claimableOpenOrders.length === 0}
                      onClick={async () => {
                        await claims(claimableOpenOrders)
                      }}
                      text="Claim All"
                      className="disabled:text-gray-400 text-white text-[13px] font-semibold w-[110px] h-8 px-3 py-1.5 disabled:bg-[#2b3544] bg-blue-500 rounded-[10px] justify-center items-center flex"
                    />
                    <ActionButton
                      disabled={cancellableOpenOrders.length === 0}
                      onClick={async () => {
                        await cancels(cancellableOpenOrders)
                      }}
                      text="Cancel All"
                      className="disabled:text-gray-400 text-white text-[13px] font-semibold w-[110px] h-8 px-3 py-1.5 disabled:bg-[#2b3544] bg-blue-500 rounded-[10px] justify-center items-center flex"
                    />
                  </div>
                </div>

                <OpenOrderCardList
                  chainId={selectedChain.id}
                  userAddress={userAddress}
                  openOrders={openOrders}
                  claims={claims}
                  cancels={cancels}
                  router={router}
                />
              </div>
            ) : (
              <></>
            )}

            {/*mobile open order card*/}
            <div className="flex lg:hidden w-full justify-center mb-28 sm:mb-0">
              <div className="flex flex-col w-full lg:w-auto h-full lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
                {openOrders.length > 0 ? (
                  <div className="flex ml-auto h-6 opacity-80 justify-start items-center gap-2">
                    <button
                      disabled={claimableOpenOrders.length === 0}
                      onClick={async () => {
                        await claims(claimableOpenOrders)
                      }}
                      className="flex flex-1 w-[95px] px-3 py-1 disabled:bg-[#2b3544] bg-[#3B82F6]/20 rounded-lg justify-center items-center disabled:text-gray-400 text-[#3B82F6] text-[13px] font-semibold"
                    >
                      Claim All
                    </button>
                    <button
                      disabled={cancellableOpenOrders.length === 0}
                      onClick={async () => {
                        await cancels(cancellableOpenOrders)
                      }}
                      className="flex flex-1 w-[95px] px-3 py-1 disabled:bg-[#2b3544] bg-[#3B82F6]/20 rounded-lg justify-center items-center disabled:text-gray-400 text-[#3B82F6] text-[13px] font-semibold"
                    >
                      Cancel All
                    </button>
                  </div>
                ) : (
                  <></>
                )}

                <OpenOrderCardList
                  chainId={selectedChain.id}
                  userAddress={userAddress}
                  openOrders={openOrders}
                  claims={claims}
                  cancels={cancels}
                  router={router}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-28 lg:mb-2" />
        )}
      </div>
      <div className="fixed flex w-full overflow-y-scroll sm:hidden bottom-0 z-[1000]">
        <div
          className={`${
            showMobileModal ? 'flex' : 'hidden'
          } w-full h-full fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm`}
          onClick={() => setShowMobileModal(false)}
        />
        <div className="w-full h-full top-0 absolute bg-[#171b24] shadow rounded-tl-2xl rounded-tr-2xl border" />
        <div className="z-[10000] w-full flex flex-col px-5 pt-5 pb-3">
          <div
            className={`${
              showMobileModal ? 'flex max-h-[560px]' : 'hidden'
            } flex-col mb-5`}
          >
            {tab === 'limit' ? (
              <LimitForm
                chainId={selectedChain.id}
                prices={prices}
                balances={balances}
                currencies={currencies}
                setCurrencies={setCurrencies}
                priceInput={priceInput}
                setPriceInput={setPriceInput}
                selectedMarket={selectedMarket}
                isBid={isBid}
                isPostOnly={isPostOnly}
                setIsPostOnly={setIsPostOnly}
                showInputCurrencySelect={showInputCurrencySelect}
                setShowInputCurrencySelect={setShowInputCurrencySelect}
                inputCurrency={inputCurrency}
                setInputCurrency={setInputCurrency}
                inputCurrencyAmount={inputCurrencyAmount}
                setInputCurrencyAmount={setInputCurrencyAmount}
                availableInputCurrencyBalance={
                  inputCurrency ? (balances[inputCurrency.address] ?? 0n) : 0n
                }
                showOutputCurrencySelect={showOutputCurrencySelect}
                setShowOutputCurrencySelect={setShowOutputCurrencySelect}
                outputCurrency={outputCurrency}
                setOutputCurrency={setOutputCurrency}
                outputCurrencyAmount={outputCurrencyAmount}
                setOutputCurrencyAmount={setOutputCurrencyAmount}
                availableOutputCurrencyBalance={
                  outputCurrency ? (balances[outputCurrency.address] ?? 0n) : 0n
                }
                swapInputCurrencyAndOutputCurrency={() => {
                  setIsBid((prevState) => !prevState)
                  setDepthClickedIndex(undefined)
                  setInputCurrencyAmount(outputCurrencyAmount)

                  // swap currencies
                  const _inputCurrency = inputCurrency
                  setInputCurrency(outputCurrency)
                  setOutputCurrency(_inputCurrency)
                }}
                minimumDecimalPlaces={availableDecimalPlacesGroups?.[0]?.value}
                marketPrice={marketPrice}
                marketRateDiff={marketRateDiff}
                setMarketRateAction={{
                  isLoading: isFetchingQuotes,
                  action: async () => {
                    await setMarketRateAction()
                  },
                }}
                closeLimitFormAction={() => setShowMobileModal(false)}
                actionButtonProps={{
                  disabled:
                    !!walletClient &&
                    (!inputCurrency ||
                      !outputCurrency ||
                      priceInput === '' ||
                      (selectedMarket &&
                        !isAddressesEqual(
                          [inputCurrency.address, outputCurrency.address],
                          [
                            selectedMarket.base.address,
                            selectedMarket.quote.address,
                          ],
                        )) ||
                      amount === 0n ||
                      amount > (balances[inputCurrency.address] ?? 0n)),
                  onClick: async () => {
                    if (!walletClient && openConnectModal) {
                      openConnectModal()
                    }
                    if (!inputCurrency || !outputCurrency || !selectedMarket) {
                      return
                    }
                    if (marketRateDiff < -2) {
                      setShowWarningModal(true)
                      return
                    }
                    await limit(
                      inputCurrency,
                      outputCurrency,
                      inputCurrencyAmount,
                      priceInput,
                      isPostOnly,
                      selectedMarket,
                    )
                  },
                  text: !walletClient
                    ? 'Connect wallet'
                    : !inputCurrency
                      ? 'Select input currency'
                      : !outputCurrency
                        ? 'Select output currency'
                        : amount === 0n
                          ? 'Enter amount'
                          : amount > balances[inputCurrency.address]
                            ? 'Insufficient balance'
                            : `Place Order`,
                }}
              />
            ) : (
              <SwapForm
                chainId={selectedChain.id}
                currencies={currencies}
                setCurrencies={setCurrencies}
                balances={balances}
                prices={prices}
                showInputCurrencySelect={showInputCurrencySelect}
                setShowInputCurrencySelect={setShowInputCurrencySelect}
                inputCurrency={inputCurrency}
                setInputCurrency={setInputCurrency}
                inputCurrencyAmount={inputCurrencyAmount}
                setInputCurrencyAmount={setInputCurrencyAmount}
                availableInputCurrencyBalance={
                  inputCurrency ? (balances[inputCurrency.address] ?? 0n) : 0n
                }
                showOutputCurrencySelect={showOutputCurrencySelect}
                setShowOutputCurrencySelect={setShowOutputCurrencySelect}
                outputCurrency={outputCurrency}
                setOutputCurrency={setOutputCurrency}
                outputCurrencyAmount={formatUnits(
                  quotes?.amountOut ?? 0n,
                  outputCurrency?.decimals ?? 18,
                )}
                slippageInput={slippageInput}
                setSlippageInput={setSlippageInput}
                aggregatorName={quotes?.aggregator?.name ?? ''}
                gasEstimateValue={
                  parseFloat(
                    formatUnits(
                      BigInt(quotes?.gasLimit ?? 0n) * (gasPrice ?? 0n),
                      selectedChain.nativeCurrency.decimals,
                    ),
                  ) * (prices[zeroAddress] ?? 0)
                }
                priceImpact={priceImpact}
                refreshQuotesAction={() => setLatestRefreshTime(Date.now())}
                closeSwapFormAction={() => setShowMobileModal(false)}
                actionButtonProps={{
                  disabled:
                    (Number(inputCurrencyAmount) > 0 &&
                      (quotes?.amountOut ?? 0n) === 0n) ||
                    !walletClient ||
                    !inputCurrency ||
                    !outputCurrency ||
                    amount === 0n ||
                    amount > balances[inputCurrency.address],
                  onClick: async () => {
                    if (!userAddress && openConnectModal) {
                      openConnectModal()
                    }

                    if (
                      !gasPrice ||
                      !userAddress ||
                      !inputCurrency ||
                      !outputCurrency ||
                      !inputCurrencyAmount ||
                      !quotes ||
                      amountIn !== quotes.amountIn
                    ) {
                      return
                    }
                    await swap(
                      inputCurrency,
                      amountIn,
                      outputCurrency,
                      quotes.amountOut,
                      parseFloat(slippageInput),
                      gasPrice,
                      userAddress,
                      AGGREGATORS[selectedChain.id].find(
                        (aggregator) =>
                          aggregator.name === quotes.aggregator.name,
                      )!,
                    )
                  },
                  text:
                    Number(inputCurrencyAmount) > 0 &&
                    (quotes?.amountOut ?? 0n) === 0n
                      ? 'Fetching...'
                      : !walletClient
                        ? 'Connect wallet'
                        : !inputCurrency
                          ? 'Select input currency'
                          : !outputCurrency
                            ? 'Select output currency'
                            : amount === 0n
                              ? 'Enter amount'
                              : amount > balances[inputCurrency.address]
                                ? 'Insufficient balance'
                                : isAddressEqual(
                                      inputCurrency.address,
                                      zeroAddress,
                                    ) &&
                                    isAddressEqual(
                                      outputCurrency.address,
                                      WETH[selectedChain.id].address,
                                    )
                                  ? 'Wrap'
                                  : isAddressEqual(
                                        inputCurrency.address,
                                        WETH[selectedChain.id].address,
                                      ) &&
                                      isAddressEqual(
                                        outputCurrency.address,
                                        zeroAddress,
                                      )
                                    ? 'Unwrap'
                                    : `Swap`,
                }}
              />
            )}
          </div>

          <button
            onClick={() => setShowMobileModal(true)}
            className={`w-full ${
              showMobileModal ? 'hidden' : 'flex'
            } h-12 bg-blue-500 rounded-xl justify-center items-center mb-5`}
          >
            <div className="grow shrink basis-0 opacity-90 text-center text-white text-base font-semibold">
              {tab === 'limit' ? 'Make order' : 'Swap'}
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
