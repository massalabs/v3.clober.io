import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'

import { dummyCurrencies } from '../../.storybook/dummy-data/currencies'

import CurrencySelect from './currency-select'

export default {
  title: 'Selector/CurrencySelector',
  component: CurrencySelect,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="w-full sm:w-[480px]">
      <CurrencySelect {...args} />
    </div>
  ),
} as Meta<typeof CurrencySelect>

type Story = StoryObj<typeof CurrencySelect>
export const Default: Story = {
  args: {
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
    currencies: dummyCurrencies,
    balances: {
      '0x0000000000000000000000000000000000000000': 1000000000000000000n,
      '0x0000000000000000000000000000000000000001': 10000000n,
      '0x0000000000000000000000000000000000000002': 100000000n,
      '0x0000000000000000000000000000000000000003': 1000000000000000000n,
      '0x0000000000000000000000000000000000000004': 100000000n,
      '0x0000000000000000000000000000000000000005': 1000000000000000000000n,
    },
    prices: {
      '0x0000000000000000000000000000000000000000': 1800,
      '0x0000000000000000000000000000000000000001': 1,
      '0x0000000000000000000000000000000000000002': 30000,
      '0x0000000000000000000000000000000000000003': 1800,
      '0x0000000000000000000000000000000000000004': 1,
      '0x0000000000000000000000000000000000000005': 1,
    },
    onBack: () => {},
    onCurrencySelect: () => {},
  },
}

export const Empty: Story = {
  args: {
    currencies: [],
    balances: {},
    prices: {},
    onBack: () => {},
    onCurrencySelect: () => {},
  },
}
