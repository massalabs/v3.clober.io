import React from 'react'
import '../../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'
import { base } from 'viem/chains'

import { currentTimestampInSeconds } from '../../utils/date'

import UserTransactionCard from './user-transaction-card'

export default {
  title: 'Card/UserTransactionCard',
  component: UserTransactionCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="w-[460px] bg-gradient-to-b from-gray-950/0 to-gray-950/70 border border-white border-solid">
      <UserTransactionCard {...args} />
    </div>
  ),
} as Meta<typeof UserTransactionCard>

type Story = StoryObj<typeof UserTransactionCard>

export const Default: Story = {
  args: {
    transaction: {
      title: 'Confirm',
      txHash: `0x${BigInt(1234567890).toString(16)}`,
      chain: base,
      type: 'type',
      success: true,
      blockNumber: 123456,
      timestamp: currentTimestampInSeconds(),
      fields: [
        {
          direction: 'in',
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'ETH ASDFASDF',
          value: '0.000000000000012',
        },
        {
          direction: 'out',
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'ETH',
          value: '0.0004',
        },
        {
          direction: 'out',
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'ETH',
          value: '2.001',
        },
      ],
    },
    isPending: false,
    explorerUrl: 'https://explorer.com',
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
