import React from 'react'
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'
import { Connector, useAccount } from 'wagmi'

import { ConnectButton } from '../button/connect-button'
import { UserButton } from '../button/user-button'
import { WrongNetworkButton } from '../button/wrong-network-button'

export function WalletSelector({
  address,
  status,
  connector,
}: {
  address: `0x${string}` | undefined
  status: 'connected' | 'disconnected' | 'reconnecting' | 'connecting'
  connector: Connector | undefined
}) {
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { chainId } = useAccount()

  return (
    <div className="flex items-center">
      {status === 'disconnected' || status === 'connecting' ? (
        <ConnectButton openConnectModal={openConnectModal} />
      ) : openAccountModal && address && connector && chainId ? (
        <UserButton
          address={address}
          openAccountModal={openAccountModal}
          connector={connector}
          chainId={chainId}
          shiny={false}
        />
      ) : openChainModal ? (
        <WrongNetworkButton openChainModal={openChainModal} />
      ) : (
        <button
          disabled={true}
          className="flex items-center h-8 py-0 px-3 md:px-4 rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 text-white disabled:text-green-500 text-xs sm:text-sm"
        >
          {status}
        </button>
      )}
    </div>
  )
}
