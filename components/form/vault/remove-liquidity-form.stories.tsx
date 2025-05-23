import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import '../../../styles/globals.css'
import { mainnet } from 'viem/chains'
import { zeroHash } from 'viem'

import { RemoveLiquidityForm } from './remove-liquidity-form'

export default {
  title: 'Form/RemoveLiquidityForm',
  component: RemoveLiquidityForm,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="flex flex-col rounded-2xl bg-gray-900 p-6 gap-6 md:gap-8 w-full sm:w-[480px] h-full">
      <RemoveLiquidityForm {...args} />
    </div>
  ),
} as Meta<typeof RemoveLiquidityForm>

type Story = StoryObj<typeof RemoveLiquidityForm>

export const Default: Story = {
  args: {
    chain: mainnet,
    vault: {
      totalSupply: 10000,
      historicalPriceIndex: [],
      key: '0x',
      salt: zeroHash,
      hasDashboard: false,
      hasPoint: false,
      reserveA: 0,
      reserveB: 0,
      lpUsdValue: 12344.3241,
      lpCurrency: {
        address: '0x0000000000000000000000000000000000000001',
        name: 'ETH-USDC-LP',
        symbol: 'ETH-USDC-LP',
        decimals: 18,
      },
      currencyA: {
        address: '0x0000000000000000000000000000000000000002',
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      currencyB: {
        address: '0x0000000000000000000000000000000000000003',
        name: 'USDC',
        symbol: 'USDC',
        decimals: 6,
      },
      apy: 120.5434,
      tvl: 43123123.0123455,
      volume24h: 123123.123411,
    },
    prices: {
      '0x0000000000000000000000000000000000000001': 50000,
      '0x0000000000000000000000000000000000000002': 50000,
      '0x0000000000000000000000000000000000000003': 0.99999,
    },
    lpCurrencyAmount: '1',
    setLpCurrencyAmount: () => {},
    availableLpCurrencyBalance: 1000999999999999900n,
    receiveCurrencies: [
      {
        currency: {
          address: '0x0000000000000000000000000000000000000002',
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        amount: 500499999999999950n,
      },
      {
        currency: {
          address: '0x0000000000000000000000000000000000000002',
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        amount: 500499999999999950n,
      },
    ],
    slippageInput: '0.5',
    setSlippageInput: () => {},
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Remove Liquidity',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
