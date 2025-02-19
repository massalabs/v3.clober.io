import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'
import { zeroAddress } from 'viem'

import { CurrencySelectButton } from './currency-select-button'

export default {
  title: 'CurrencySelectButton',
  component: CurrencySelectButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof CurrencySelectButton>

type Story = StoryObj<typeof CurrencySelectButton>

export const Default: Story = {
  args: {},
}

export const Selected: Story = {
  args: {
    currency: {
      name: 'Ethereum',
      symbol: 'ETH',
      address: zeroAddress,
      decimals: 18,
    },
    onCurrencyClick: () => {},
  },
}
