import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'
import { mainnet } from 'viem/chains'

import LpCurrencyAmountInput from './lp-currency-amount-input'

export default {
  title: 'Input/LpCurrencyAmountInput',
  component: LpCurrencyAmountInput,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="border border-solid border-gray-700">
      <LpCurrencyAmountInput {...args} />
    </div>
  ),
} as Meta<typeof LpCurrencyAmountInput>

type Story = StoryObj<typeof LpCurrencyAmountInput>
export const Default: Story = {
  args: {
    chain: mainnet,
    currency: {
      address: '0x0000000000000000000000000000000000000003',
      name: 'WETH-USDC-LP',
      symbol: 'WETH-USDC-LP',
      decimals: 18,
    },
    currency0: {
      address: '0x0000000000000000000000000000000000000004',
      name: 'WETH',
      symbol: 'WETH',
      decimals: 18,
    },
    currency1: {
      address: '0x0000000000000000000000000000000000000005',
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
    },
    value: '1',
    onValueChange: () => {},
    availableAmount: 1000000000000000000n,
    price: 1780,
  },
}

export const SelectToken: Story = {
  args: {
    chain: mainnet,
    value: '0',
    onValueChange: () => {},
    availableAmount: 1000000000000000000n,
    price: 1780,
    onCurrencyClick: () => {},
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
