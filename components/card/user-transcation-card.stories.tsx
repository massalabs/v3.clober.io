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
    <div className="w-[288px]">
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
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'Field 1',
          value: 'Value 1',
        },
        {
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'Field 1',
          value: 'Value 1',
        },
      ],
    },
  },
}

export const DefaultWithDirection: Story = {
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
          label: 'Field 1',
          value: 'Value 1',
        },
        {
          direction: 'out',
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'Field 1',
          value: 'Value 1',
        },
        {
          direction: 'out',
          currency: {
            address: '0x0000000000000000000000000000000000000003',
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          label: 'Field 1',
          value: 'Value 1',
        },
      ],
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
