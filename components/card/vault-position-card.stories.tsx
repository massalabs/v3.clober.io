import React from 'react'
import '../../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'
import { mainnet } from 'viem/chains'

import { VaultPositionCard } from './vault-position-card'

export default {
  title: 'Card/VaultPositionCard',
  component: VaultPositionCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="flex w-[300px]">
      <VaultPositionCard {...args} />
    </div>
  ),
} as Meta<typeof VaultPositionCard>

type Story = StoryObj<typeof VaultPositionCard>

export const Default: Story = {
  args: {
    chain: mainnet,
    vaultPosition: {
      vault: {
        totalSupply: 10000,
        historicalPriceIndex: [],
        key: '0x',
        lpUsdValue: 12344.3241,
        lpCurrency: {
          address: '0x0000000000000000000000000000000000000003',
          name: 'ETH-USDC-LP',
          symbol: 'ETH-USDC-LP',
          decimals: 18,
        },
        currencyA: {
          address: '0x0000000000000000000000000000000000000003',
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
        reserveA: 123123.123411,
        reserveB: 123123.123411,
      },
      amount: BigInt('1231231231230000000000'),
      value: 123,
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
