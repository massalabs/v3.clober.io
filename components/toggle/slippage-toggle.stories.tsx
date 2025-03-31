import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { SlippageToggle } from './slippage-toggle'
export default {
  title: 'Toggle/SlippageToggle',
  component: SlippageToggle,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof SlippageToggle>

type Story = StoryObj<typeof SlippageToggle>

export const Default: Story = {
  args: {
    slippageInput: '1',
    setSlippageInput: () => {},
  },
}

export const Custom: Story = {
  args: {
    slippageInput: '3',
    setSlippageInput: () => {},
  },
}
