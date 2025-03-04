import React from 'react'
import { Connector } from 'wagmi'

import { textStyles } from '../../themes/text-styles'
import { formatAddress } from '../../utils/string'

export const UserButton = ({
  address,
  connector,
  openAccountModal,
}: {
  address: `0x${string}`
  connector: Connector
  openAccountModal: () => void
}) => {
  return (
    <button
      className="flex items-center justify-center gap-2 md:justify-start rounded md:w-full py-0 px-2 md:px-4 cursor-pointer h-8 bg-transparent hover:bg-gray-600 active::bg-gray-600"
      onClick={() => openAccountModal && openAccountModal()}
    >
      <img
        src={connector.icon}
        alt="user icon"
        className="w-4 h-4 rounded-[100%] aspect-square"
      />
      <span className={`hidden md:block text-white ${textStyles.body3Bold}`}>
        {formatAddress(address || '')}
      </span>
    </button>
  )
}
