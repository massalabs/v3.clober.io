import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import '../../styles/globals.css'
import { Legend } from './legend'

export default {
  title: 'Chart/Legend',
  component: Legend,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="text-white">
      <Legend {...args} />
    </div>
  ),
} as Meta<typeof Legend>

type Story = StoryObj<typeof Legend>

export const Default: Story = {
  args: {
    data: [
      {
        label: 'v2',
        color: '#4C82FB',
        value: '1632677264.9896278',
      },
      {
        label: 'v3',
        color: '#FC72FF',
        value: '1554154844.6900728',
      },
    ],
  },
}
