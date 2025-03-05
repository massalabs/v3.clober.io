import React from 'react'
import { Connector } from 'wagmi'

import { textStyles } from '../../themes/text-styles'
import { formatAddress } from '../../utils/string'
import ChainIcon from '../icon/chain-icon'
import { supportChains } from '../../constants/chain'
import UserIcon from '../icon/user-icon'

export const UserButton = ({
  address,
  connector,
  chainId,
  openAccountModal,
}: {
  address: `0x${string}`
  connector: Connector
  chainId: number
  openAccountModal: () => void
}) => {
  const chain = supportChains.find((chain) => chain.id === chainId)!
  return (
    <button
      className="flex items-center justify-center gap-2 md:justify-start rounded md:w-full py-0 px-2 md:px-4 cursor-pointer h-8 bg-transparent hover:bg-gray-600 active::bg-gray-600"
      onClick={() => openAccountModal && openAccountModal()}
    >
      <div className="w-6 h-4 relative">
        {connector.icon ? (
          <img
            src={connector.icon}
            alt="user-icon"
            className="w-4 h-4 absolute left-0 top-0 z-[2] rounded-full"
          />
        ) : (
          <UserIcon
            className="w-4 h-4 absolute left-0 top-0 z-[2] rounded-full aspect-square"
            address={address}
          />
        )}
        <ChainIcon
          chain={chain}
          className="w-4 h-4 absolute left-2 top-0 z-[1] rounded-full"
        />
      </div>

      <span className={`hidden md:block text-white ${textStyles.body3Bold}`}>
        {formatAddress(address || '')}
      </span>
    </button>
  )
}
