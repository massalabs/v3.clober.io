import React from 'react'
import '../../../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'
import { mainnet } from 'viem/chains'
import { zeroHash } from 'viem'

import { AddLiquidityForm } from './add-liquidity-form'

export default {
  title: 'Form/AddLiquidityForm',
  component: AddLiquidityForm,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="flex flex-col rounded-2xl bg-gray-900 p-6 gap-6 md:gap-8 w-full sm:w-[480px] h-[552px]">
      <AddLiquidityForm {...args} />
    </div>
  ),
} as Meta<typeof AddLiquidityForm>

type Story = StoryObj<typeof AddLiquidityForm>

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
    currency0Amount: '1',
    setCurrency0Amount: () => {},
    availableCurrency0Balance: 1000999999999999900n,
    currency1Amount: '1',
    setCurrency1Amount: () => {},
    availableCurrency1Balance: 1000999n,
    disableSwap: true,
    setDisableSwap: () => {},
    disableDisableSwap: false,
    slippageInput: '0.5',
    setSlippageInput: () => {},
    receiveLpCurrencyAmount: 1000999999999999900n,
    isCalculatingReceiveLpAmount: true,
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Add Liquidity',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
