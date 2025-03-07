import { Meta, StoryObj } from '@storybook/react'
import '../../../styles/globals.css'
import { zeroAddress } from 'viem'

import { MintFutureAssetForm } from './mint-future-asset-form'

export default {
  title: 'Form/MintFutureAssetForm',
  component: MintFutureAssetForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof MintFutureAssetForm>

type Story = StoryObj<typeof MintFutureAssetForm>
export const Default: Story = {
  args: {
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
      settlePrice: 315234,
    },
    actionButtonProps: {
      disabled: false,
      onClick: () => {},
      text: 'Borrow',
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
