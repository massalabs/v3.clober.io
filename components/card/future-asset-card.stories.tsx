import '../../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'
import { base } from 'viem/chains'
import { zeroAddress } from 'viem'

import { FutureAssetCard } from './future-asset-card'

export default {
  title: 'FutureAssetCard',
  component: FutureAssetCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof FutureAssetCard>

type Story = StoryObj<typeof FutureAssetCard>

export const Default: Story = {
  args: {
    chainId: base.id,
    asset: {
      id: '0x',
      currency: {
        address: zeroAddress,
        decimals: 18,
        name: 'AAPL',
        symbol: 'AAPL',
        icon: 'https://www.pyth.network/_next/image?url=%2Ficons%2Fprice-feed-icons%2Flight%2Fequity-us-aapl-usd.inline.svg&w=1920&q=75',
        priceFeedId:
          '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688',
      },
      collateral: {
        address: '0x43D614B1bA4bA469fAEAa4557AEAFdec039b8795',
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        priceFeedId:
          '0x49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688',
      },
      expiration: 1635724800,
      maxLTV: 700000n,
      liquidationThreshold: 800000n,
      ltvPrecision: 1000000n,
      minDebt: 10n * 10n ** 6n,
      settlePrice: 254000,
    },
  },
}
