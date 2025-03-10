import React, { useCallback, useMemo } from 'react'
import { isAddressEqual, parseUnits } from 'viem'

import CurrencyAmountInput from '../input/currency-amount-input'
import { Currency } from '../../model/currency'
import CurrencySelect from '../selector/currency-select'
import { toPlacesString } from '../../utils/bignumber'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import { Prices } from '../../model/prices'
import { Balances } from '../../model/balances'
import { ExchangeSvg } from '../svg/exchange-svg'
import CloseSvg from '../svg/close-svg'
import { SlippageToggle } from '../toggle/slippage-toggle'

export const SwapForm = ({
  chainId,
  currencies,
  setCurrencies,
  balances,
  prices,
  showInputCurrencySelect,
  setShowInputCurrencySelect,
  inputCurrency,
  setInputCurrency,
  inputCurrencyAmount,
  setInputCurrencyAmount,
  availableInputCurrencyBalance,
  showOutputCurrencySelect,
  setShowOutputCurrencySelect,
  outputCurrency,
  setOutputCurrency,
  outputCurrencyAmount,
  slippageInput,
  setSlippageInput,
  gasEstimateValue,
  aggregatorName,
  refreshQuotesAction,
  closeSwapFormAction,
  actionButtonProps,
}: {
  chainId: number
  currencies: Currency[]
  setCurrencies: (currencies: Currency[]) => void
  balances: Balances
  prices: Prices
  showInputCurrencySelect: boolean
  setShowInputCurrencySelect:
    | ((showInputCurrencySelect: boolean) => void)
    | undefined
  inputCurrency: Currency | undefined
  setInputCurrency: (inputCurrency: Currency | undefined) => void
  inputCurrencyAmount: string
  setInputCurrencyAmount: (inputCurrencyAmount: string) => void
  availableInputCurrencyBalance: bigint
  showOutputCurrencySelect: boolean
  setShowOutputCurrencySelect:
    | ((showOutputCurrencySelect: boolean) => void)
    | undefined
  outputCurrency: Currency | undefined
  setOutputCurrency: (outputCurrency: Currency | undefined) => void
  outputCurrencyAmount: string
  slippageInput: string
  setSlippageInput: (slippageInput: string) => void
  gasEstimateValue: number
  aggregatorName: string
  refreshQuotesAction: () => void
  closeSwapFormAction: () => void
  actionButtonProps: ActionButtonProps
}) => {
  const isLoadingResults = useMemo(() => {
    return !!(
      inputCurrency &&
      outputCurrency &&
      parseUnits(inputCurrencyAmount, inputCurrency?.decimals ?? 18) > 0n &&
      parseUnits(outputCurrencyAmount, outputCurrency?.decimals ?? 18) === 0n
    )
  }, [inputCurrency, inputCurrencyAmount, outputCurrency, outputCurrencyAmount])

  const swapCurrencies = useCallback(() => {
    const prevInputCurrency = inputCurrency
    setInputCurrency(outputCurrency)
    setOutputCurrency(prevInputCurrency)
    setInputCurrencyAmount('')
  }, [
    inputCurrency,
    outputCurrency,
    setInputCurrency,
    setInputCurrencyAmount,
    setOutputCurrency,
  ])

  return showInputCurrencySelect ? (
    <CurrencySelect
      chainId={chainId}
      currencies={
        outputCurrency
          ? currencies.filter(
              (currency) =>
                !isAddressEqual(currency.address, outputCurrency.address),
            )
          : currencies
      }
      balances={balances}
      prices={prices}
      onBack={() =>
        setShowInputCurrencySelect
          ? setShowInputCurrencySelect(false)
          : undefined
      }
      onCurrencySelect={(currency) => {
        if (setShowInputCurrencySelect) {
          setCurrencies(
            !currencies.find((c) => isAddressEqual(c.address, currency.address))
              ? [...currencies, currency]
              : currencies,
          )
          setInputCurrency(currency)
          setShowInputCurrencySelect(false)
        }
      }}
      defaultBlacklistedCurrency={outputCurrency}
    />
  ) : showOutputCurrencySelect ? (
    <CurrencySelect
      chainId={chainId}
      currencies={
        inputCurrency
          ? currencies.filter(
              (currency) =>
                !isAddressEqual(currency.address, inputCurrency.address),
            )
          : currencies
      }
      balances={balances}
      prices={prices}
      onBack={() =>
        setShowOutputCurrencySelect
          ? setShowOutputCurrencySelect(false)
          : undefined
      }
      onCurrencySelect={(currency) => {
        if (setShowOutputCurrencySelect) {
          setCurrencies(
            !currencies.find((c) => isAddressEqual(c.address, currency.address))
              ? [...currencies, currency]
              : currencies,
          )
          setOutputCurrency(currency)
          setShowOutputCurrencySelect(false)
        }
      }}
      defaultBlacklistedCurrency={inputCurrency}
    />
  ) : (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-start gap-4 self-stretch">
        <div className="flex flex-row gap-1 items-center h-6 opacity-90 text-white text-base font-semibold">
          Swap {inputCurrency?.symbol ?? ''} &#8594;{' '}
          {outputCurrency?.symbol ?? ''}
        </div>
        <button
          className="flex sm:hidden w-5 h-5 ml-auto"
          onClick={closeSwapFormAction}
        >
          <CloseSvg />
        </button>
      </div>

      <div className="flex flex-col gap-5 self-stretch w-full">
        <div className="flex flex-col gap-5 self-stretch">
          <div className="flex flex-col w-full relative gap-5 self-stretch">
            <div className="flex flex-col w-full gap-2.5 sm:gap-3 self-stretch items-start">
              <div className="flex items-center w-full gap-3 self-stretch text-gray-500 text-xs sm:text-sm font-semibold">
                Pay
                <div className="flex ml-auto mr-2">
                  <button
                    onClick={refreshQuotesAction}
                    className="flex w-4 h-4 sm:w-6 sm:h-6"
                  >
                    <ExchangeSvg className="w-full h-full hover:animate-spin" />
                  </button>
                </div>
              </div>
              <CurrencyAmountInput
                currency={inputCurrency}
                value={inputCurrencyAmount}
                onValueChange={setInputCurrencyAmount}
                availableAmount={availableInputCurrencyBalance}
                onCurrencyClick={
                  setShowInputCurrencySelect
                    ? () => setShowInputCurrencySelect(true)
                    : undefined
                }
                price={
                  inputCurrency
                    ? (prices[inputCurrency.address] ?? 0)
                    : undefined
                }
              />
            </div>

            <div className="flex flex-col w-full gap-2.5 sm:gap-3 self-stretch items-start">
              <div className="flex items-center w-full gap-3 self-stretch text-gray-500 text-xs sm:text-sm font-semibold">
                Receive
              </div>
              <CurrencyAmountInput
                currency={outputCurrency}
                value={outputCurrencyAmount}
                onValueChange={() => {}}
                availableAmount={0n}
                onCurrencyClick={
                  setShowOutputCurrencySelect
                    ? () => setShowOutputCurrencySelect(true)
                    : undefined
                }
                price={
                  outputCurrency
                    ? (prices[outputCurrency.address] ?? 0)
                    : undefined
                }
                disabled={true}
              />
            </div>

            <div className="absolute flex items-center justify-center top-[56%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-900 p-1 sm:p-1.5">
              <button
                className="flex items-center justify-center p-0 bg-gray-700 w-full h-full rounded-full transform hover:rotate-180 transition duration-300"
                onClick={swapCurrencies}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M4.08335 12.25L4.08335 1.75M4.08335 12.25L2.33335 10.5M4.08335 12.25L5.83335 10.5M8.16669 3.5L9.91669 1.75M9.91669 1.75L11.6667 3.5M9.91669 1.75L9.91669 12.25"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 mb-1 md:mb-2 text-[13px] sm:text-sm font-medium">
          <div className="flex flex-col items-start gap-6 md:gap-4 self-stretch justify-end text-white text-[13px] sm:text-sm">
            <div className="flex items-center gap-2 self-stretch">
              <div className="text-gray-400">Gas fee</div>
              <div className="flex ml-auto">
                {!Number.isNaN(gasEstimateValue) ? (
                  <div className="flex relative h-full sm:h-[20px] items-center text-xs sm:text-sm text-white ml-auto">
                    {isLoadingResults ? (
                      <span className="w-[50px] h-full mx-1 rounded animate-pulse bg-gray-500" />
                    ) : (
                      <div className="text-xs sm:text-sm text-gray-400 flex flex-row gap-1 items-center">
                        <span className="text-white">
                          ${toPlacesString(gasEstimateValue)}
                        </span>
                        {aggregatorName.length > 0 ? (
                          <>
                            via
                            <div className="text-gray-400">
                              {aggregatorName}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 self-stretch">
              <div className="text-gray-400">Max Slippage</div>
              <div className="flex ml-auto">
                <SlippageToggle
                  slippageInput={slippageInput}
                  setSlippageInput={setSlippageInput}
                />
              </div>
            </div>
          </div>

          {/*todo*/}
          {/*<button className="h-7 py-1 bg-blue-500/20 rounded-xl justify-center items-center gap-1 flex w-fit px-2">*/}
          {/*  <svg*/}
          {/*    xmlns="http://www.w3.org/2000/svg"*/}
          {/*    width="12"*/}
          {/*    height="13"*/}
          {/*    viewBox="0 0 12 13"*/}
          {/*    fill="none"*/}
          {/*  >*/}
          {/*    <path*/}
          {/*      d="M6 10H8.25C8.71413 10 9.15925 9.81563 9.48744 9.48744C9.81563 9.15925 10 8.71413 10 8.25C10 7.78587 9.81563 7.34075 9.48744 7.01256C9.15925 6.68437 8.71413 6.5 8.25 6.5H4.25C3.78587 6.5 3.34075 6.31563 3.01256 5.98744C2.68437 5.65925 2.5 5.21413 2.5 4.75C2.5 4.28587 2.68437 3.84075 3.01256 3.51256C3.34075 3.18437 3.78587 3 4.25 3H6M2 10C2 10.2652 2.10536 10.5196 2.29289 10.7071C2.48043 10.8946 2.73478 11 3 11C3.26522 11 3.51957 10.8946 3.70711 10.7071C3.89464 10.5196 4 10.2652 4 10C4 9.73478 3.89464 9.48043 3.70711 9.29289C3.51957 9.10536 3.26522 9 3 9C2.73478 9 2.48043 9.10536 2.29289 9.29289C2.10536 9.48043 2 9.73478 2 10ZM8 3C8 3.26522 8.10536 3.51957 8.29289 3.70711C8.48043 3.89464 8.73478 4 9 4C9.26522 4 9.51957 3.89464 9.70711 3.70711C9.89464 3.51957 10 3.26522 10 3C10 2.73478 9.89464 2.48043 9.70711 2.29289C9.51957 2.10536 9.26522 2 9 2C8.73478 2 8.48043 2.10536 8.29289 2.29289C8.10536 2.48043 8 2.73478 8 3Z"*/}
          {/*      stroke="#22D3EE"*/}
          {/*      strokeLinecap="round"*/}
          {/*      strokeLinejoin="round"*/}
          {/*    />*/}
          {/*  </svg>*/}
          {/*  <div className="text-center text-blue-500 text-[11px] font-semibold">*/}
          {/*    Swap Route*/}
          {/*  </div>*/}
          {/*</button>*/}
        </div>
      </div>

      <ActionButton {...actionButtonProps} />
    </div>
  )
}
