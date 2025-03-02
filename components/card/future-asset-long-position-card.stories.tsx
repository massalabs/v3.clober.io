import '../../styles/globals.css'
import { Meta, StoryObj } from '@storybook/react'
import { zeroAddress } from 'viem'

import { FutureAssetLongPositionCard } from './future-asset-long-position-card'

export default {
  title: 'FutureAssetLongPositionCard',
  component: FutureAssetLongPositionCard,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof FutureAssetLongPositionCard>

type Story = StoryObj<typeof FutureAssetLongPositionCard>

export const Default: Story = {
  args: {
    position: {
      user: zeroAddress,
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
      },
      averagePrice: 123.12,
      collateralAmount: 100n * 10n ** 6n,
      debtAmount: 10n * 10n ** 18n,
      liquidationPrice: 123.12,
      ltv: 10,
      type: 'long',
      pnl: 98.01,
      profit: 123.12,
    },
    loanAssetPrice: 145.12,
  },
}
