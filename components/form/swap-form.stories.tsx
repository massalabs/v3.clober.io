import React from 'react'
import '../../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'
import { mainnet } from 'viem/chains'

import { dummyCurrencies } from '../../.storybook/dummy-data/currencies'
import { dummyPrices } from '../../.storybook/dummy-data/prices'

import { SwapForm } from './swap-form'

export default {
  title: 'Form/SwapForm',
  component: SwapForm,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="flex flex-col rounded-2xl bg-gray-900 p-6 w-full sm:w-[480px] h-[616px]">
      <SwapForm {...args} />
    </div>
  ),
} as Meta<typeof SwapForm>

type Story = StoryObj<typeof SwapForm>

export const Default: Story = {
  args: {
    chain: mainnet,
    explorerUrl: 'https://etherscan.io',
    currencies: dummyCurrencies,
    setCurrencies: () => {},
    prices: dummyPrices,
    showInputCurrencySelect: false,
    setShowInputCurrencySelect: () => {},
    inputCurrency: undefined,
    setInputCurrency: () => {},
    inputCurrencyAmount: '0.1',
    setInputCurrencyAmount: () => {},
    availableInputCurrencyBalance: 10000000000000000000n,
    showOutputCurrencySelect: false,
    setShowOutputCurrencySelect: () => {},
    outputCurrency: undefined,
    setOutputCurrency: () => {},
    outputCurrencyAmount: '0.1',
    gasEstimateValue: 0.0,
    aggregatorName: 'Uniswap',
    refreshQuotesAction: () => {},
    closeSwapFormAction: () => {},
    priceImpact: 0.01,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Swap',
    },
  },
}

export const Selected: Story = {
  args: {
    chain: mainnet,
    currencies: dummyCurrencies,
    setCurrencies: () => {},
    prices: dummyPrices,
    showInputCurrencySelect: false,
    setShowInputCurrencySelect: () => {},
    inputCurrency: dummyCurrencies[3],
    setInputCurrency: () => {},
    inputCurrencyAmount: '1.123',
    setInputCurrencyAmount: () => {},
    availableInputCurrencyBalance: 10000000000000000000n,
    showOutputCurrencySelect: false,
    setShowOutputCurrencySelect: () => {},
    outputCurrency: dummyCurrencies[5],
    setOutputCurrency: () => {},
    outputCurrencyAmount: '2000',
    slippageInput: '1.00',
    setSlippageInput: () => {},
    gasEstimateValue: 1.12,
    refreshQuotesAction: () => {},
    closeSwapFormAction: () => {},
    priceImpact: 0.01,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Swap',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
