import React from 'react'

import { Chain } from '../../model/chain'

export default function ChainIcon({
  chain,
  ...props
}: React.BaseHTMLAttributes<HTMLDivElement> & {
  chain: Chain
}) {
  const name = chain.name.toLowerCase().split(' ')[0]
  return (
    <div {...props}>
      <img
        src={chain.icon || `https://assets.odos.xyz/chains/${name}.png`}
        alt="ChainIcon"
        className="w-full h-full object-contain"
      />
    </div>
  )
}
