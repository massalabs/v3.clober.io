import React, { useState } from 'react'
import Link from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter } from 'next/router'
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'
import { monadTestnet } from 'viem/chains'

import { useChainContext } from '../contexts/chain-context'
import ChainSelector from '../components/selector/chain-selector'
import { supportChains } from '../constants/chain'
import MenuSvg from '../components/svg/menu-svg'
import { PageButton } from '../components/button/page-button'
import { SwapPageSvg } from '../components/svg/swap-page-svg'
import { VaultPageSvg } from '../components/svg/vault-page-svg'
import { LimitPageSvg } from '../components/svg/limit-page-svg'
import { ConnectButton } from '../components/button/connect-button'
import { UserButton } from '../components/button/user-button'
import { WrongNetworkButton } from '../components/button/wrong-network-button'
import { UserTransactionsModal } from '../components/modal/user-transactions-modal'
import { useTransactionContext } from '../contexts/transaction-context'
import { UserPointButton } from '../components/button/user-point-button'
import { usePointContext } from '../contexts/point-context'
import { DiscoverPageSvg } from '../components/svg/discover-page-svg'
import { PointPageSvg } from '../components/svg/point-page-svg'

const HeaderContainer = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const router = useRouter()
  const { selectedChain, setSelectedChain } = useChainContext()
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
              href="https://alpha.clober.io/futures?chain=10143"
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
            {chainId === monadTestnet.id && (
              <PageButton
                disabled={router.pathname.includes('/discover')}
                onClick={() => {
                  router.push(`/discover?chain=${monadTestnet.id}`)
                }}
              >
                <DiscoverPageSvg className="w-4 h-4" />
                Discover
              </PageButton>
            )}

            <PageButton
              disabled={router.pathname.includes('/trade')}
              onClick={() => {
                router.push(`/trade?chain=${selectedChain.id}`)
              }}
            >
              <SwapPageSvg className="w-4 h-4" />
              Trade
            </PageButton>

            <PageButton
              disabled={router.pathname.includes('/earn')}
              onClick={() => {
                router.push(`/earn?chain=${selectedChain.id}`)
              }}
            >
              <VaultPageSvg className="w-4 h-4" />
              Earn
            </PageButton>

            {selectedChain.id === monadTestnet.id && (
              <>
                <PageButton
                  disabled={router.pathname.includes('/point')}
                  onClick={() => {
                    router.push(`/point?chain=${selectedChain.id}`)
                  }}
                >
                  <PointPageSvg className="w-4 h-4" />
                  Point
                </PageButton>

                <PageButton
                  disabled={router.pathname.includes('/futures')}
                  onClick={() => {
                    router.push(`/futures?chain=${monadTestnet.id}`)
                  }}
                >
                  <LimitPageSvg className="w-4 h-4" />
                  Futures
                </PageButton>

                <PageButton
                  disabled={router.pathname.includes('/analytics')}
                  onClick={() => {
                    router.push(`/analytics?chain=${monadTestnet.id}`)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M8.56634 0C6.18614 0 0.323975 5.6896 0.323975 7.99995C0.323975 10.3103 6.18614 16 8.56634 16C10.9465 16 16.8088 10.3102 16.8088 7.99995C16.8088 5.6897 10.9467 0 8.56634 0ZM7.28192 12.5746C6.2782 12.3092 3.57963 7.7275 3.85319 6.7533C4.12674 5.77905 8.84715 3.15989 9.85082 3.4254C10.8546 3.69087 13.5532 8.27245 13.2796 9.2467C13.0061 10.2209 8.28564 12.8401 7.28192 12.5746Z"
                      fill="#6B7280"
                    />
                  </svg>
                  Analytics
                </PageButton>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-auto md:gap-4 ml-auto">
          {supportChains.length > 1 ? (
            <ChainSelector
              chain={selectedChain}
              setChain={setSelectedChain}
              chains={supportChains}
            />
          ) : (
            <></>
          )}
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
                address={address}
                openTransactionHistoryModal={() =>
                  setOpenTransactionHistoryModal(true)
                }
                connector={connector}
                chainId={chainId}
                shiny={pendingTransactions.length > 0}
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
