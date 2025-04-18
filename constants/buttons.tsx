import { base, monadTestnet } from 'viem/chains'
import React from 'react'

import { DiscoverPageSvg } from '../components/svg/discover-page-svg'
import { SwapPageSvg } from '../components/svg/swap-page-svg'
import { VaultPageSvg } from '../components/svg/vault-page-svg'
import { LimitPageSvg } from '../components/svg/limit-page-svg'

import { riseSepolia } from './chains/rise-sepolia'

export const PAGE_BUTTONS = [
  {
    path: '/discover',
    label: 'Discover',
    icon: <DiscoverPageSvg className="w-4 h-4" />,
    chains: [monadTestnet.id],
  },
  {
    path: '/trade',
    label: 'Trade',
    icon: <SwapPageSvg className="w-4 h-4" />,
    chains: [base.id, monadTestnet.id, riseSepolia.id],
  },
  {
    path: '/earn',
    label: 'Earn',
    icon: <VaultPageSvg className="w-4 h-4" />,
    chains: [base.id, monadTestnet.id],
  },
  {
    path: '/futures',
    label: 'Futures',
    icon: <LimitPageSvg className="w-4 h-4" />,
    chains: [monadTestnet.id],
  },
]
