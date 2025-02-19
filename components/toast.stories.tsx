import React from 'react'
import '../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'

import { Toast } from './toast'
import { ClipboardSvg } from './svg/clipboard-svg'

export default {
  title: 'Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  render: (args) => <Toast {...args} />,
} as Meta<typeof Toast>

type Story = StoryObj<typeof Toast>
export const Default: Story = {
  args: {
    isCopyToast: true,
    setIsCopyToast: () => {},
    durationInMs: 3000,
    children: (
      <div className="flex flex-row gap-1.5 text-white text-sm font-semibold">
        <ClipboardSvg />
        Address copied to clipboard
      </div>
    ),
  },
}
