import React, { useState } from 'react'
import Link from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter } from 'next/router'
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'
import { base, monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'
import MenuSvg from '../components/svg/menu-svg'
import { PageButton } from '../components/button/page-button'
import { SwapPageSvg } from '../components/svg/swap-page-svg'
import { VaultPageSvg } from '../components/svg/vault-page-svg'
import { LimitPageSvg } from '../components/svg/limit-page-svg'
import { ConnectButton } from '../components/button/connect-button'
import { UserButton } from '../components/button/user-button'
import { UserTransactionsModal } from '../components/modal/user-transactions-modal'
import { useTransactionContext } from '../contexts/transaction-context'
import { UserPointButton } from '../components/button/user-point-button'
import { usePointContext } from '../contexts/point-context'
import { DiscoverPageSvg } from '../components/svg/discover-page-svg'
import { PointPageSvg } from '../components/svg/point-page-svg'
import ChainIcon from '../components/icon/chain-icon'
import { textStyles } from '../themes/text-styles'
import { riseSepolia } from '../constants/chains/rise-sepolia'
import { PAGE_BUTTONS } from '../constants/buttons'

const WrongNetwork = ({
  openChainModal,
}: { openChainModal: () => void } & any) => {
  return <>{openChainModal && openChainModal()}</>
}

const PageButtons = () => {
  const router = useRouter()
  const { selectedChain } = useChainContext()

  return (
    <>
      {PAGE_BUTTONS.map(
        (page) =>
          (page.chains as number[]).includes(selectedChain.id) && (
            <PageButton
              key={page.path}
              disabled={router.pathname.includes(page.path)}
              onClick={() => router.push(page.path)}
            >
              {page.icon}
              {page.label}
            </PageButton>
          ),
      )}
    </>
  )
}

const HeaderContainer = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const { chainId, address, status, connector } = useAccount()
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { disconnectAsync } = useDisconnect()
  const { myVaultPoint } = usePointContext()
  const [openTransactionHistoryModal, setOpenTransactionHistoryModal] =
    useState(false)
  const { pendingTransactions, transactionHistory } = useTransactionContext()

  return (
    <>
      {openTransactionHistoryModal && address && connector && (
        <UserTransactionsModal
          chain={selectedChain}
          userAddress={address}
          connector={connector}
          pendingTransactions={pendingTransactions}
          transactionHistory={transactionHistory}
          disconnectAsync={disconnectAsync}
          onClose={() => setOpenTransactionHistoryModal(false)}
        />
      )}

      <div className="flex items-center justify-between h-[46px] md:h-[60px] py-0 px-4">
        <div className="flex items-center gap-2.5 md:gap-12">
          {router.pathname.includes('/futures') ? (
            <Link
              className="flex gap-2 items-center"
              target="_blank"
              href="https://alpha.clober.io/futures"
              rel="noreferrer"
            >
              <img className="h-7 sm:h-9" src="/futures-logo.svg" alt="logo" />
            </Link>
          ) : (
            <Link
              className="flex gap-2 items-center"
              target="_blank"
              href="https://clober.io"
              rel="noreferrer"
            >
              <img className="h-5 md:h-7" src="/logo.svg" alt="logo" />
            </Link>
          )}
          <div className="hidden xl:flex py-1 justify-start items-center gap-8">
            <PageButtons />
          </div>
        </div>
        <div className="flex gap-2 w-auto md:gap-4 ml-auto">
          <div className="flex relative justify-center items-center">
            <div className="flex items-center justify-center lg:justify-start h-8 w-8 lg:w-auto p-0 lg:px-4 lg:gap-2 rounded bg-gray-800 hover:bg-gray-700 text-white">
              <ChainIcon className="w-4 h-4" chain={selectedChain} />
              <p className={`hidden lg:block ${textStyles.body3Bold}`}>
                {selectedChain.name}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-row gap-1 sm:gap-3">
            {address && (
              <div className="flex w-full">
                <UserPointButton score={myVaultPoint?.point ?? 0} />
              </div>
            )}
            {status === 'disconnected' || status === 'connecting' ? (
              <ConnectButton openConnectModal={openConnectModal} />
            ) : openAccountModal && address && connector && chainId ? (
              <UserButton
                chain={selectedChain}
                address={address}
                openTransactionHistoryModal={() =>
                  setOpenTransactionHistoryModal(true)
                }
                connector={connector}
                shiny={pendingTransactions.length > 0}
              />
            ) : openChainModal ? (
              <WrongNetwork openChainModal={openChainModal} />
            ) : (
              <button
                disabled={true}
                className="flex items-center h-8 py-0 px-3 md:px-4 rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 text-white disabled:text-green-500 text-xs sm:text-sm"
              >
                {status}
              </button>
            )}
          </div>
          <button
            className="w-8 h-8 lg:hover:bg-gray-200 hover:bg-gray-700 rounded sm:rounded-lg flex items-center justify-center"
            onClick={onMenuClick}
          >
            <MenuSvg />
          </button>
        </div>
      </div>
    </>
  )
}

export default HeaderContainer
