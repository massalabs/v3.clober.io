import { Meta, StoryObj } from '@storybook/react'
import '../../styles/globals.css'
import { base } from 'viem/chains'
import { Connector } from 'wagmi'

import { UserButton } from './user-button'

export default {
  title: 'Button/UserButton',
  component: UserButton,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof UserButton>

type Story = StoryObj<typeof UserButton>

export const Default: Story = {
  args: {
    address: '0x0F97F07d7473EFB5c846FB2b6c201eC1E316E994',
    chain: base,
    connector: {
      icon: undefined,
    } as Connector,
    openTransactionHistoryModal: () => {},
  },
}

export const Shiny: Story = {
  args: {
    address: '0x0F97F07d7473EFB5c846FB2b6c201eC1E316E994',
    chain: base,
    connector: {
      icon: undefined,
    } as Connector,
    openTransactionHistoryModal: () => {},
    shiny: true,
  },
}
