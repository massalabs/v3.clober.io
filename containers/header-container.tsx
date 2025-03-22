import React, { useState } from 'react'
import Link from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { useRouter } from 'next/router'
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit'

import { useChainContext } from '../contexts/chain-context'
import ChainSelector from '../components/selector/chain-selector'
import { supportChains } from '../constants/chain'
import MenuSvg from '../components/svg/menu-svg'
import { DocsIconSvg } from '../components/svg/docs-icon-svg'
import { DiscordLogoSvg } from '../components/svg/discord-logo-svg'
import { TwitterLogoSvg } from '../components/svg/twitter-logo-svg'
import { PageButton } from '../components/button/page-button'
import { SwapPageSvg } from '../components/svg/swap-page-svg'
import { VaultPageSvg } from '../components/svg/vault-page-svg'
import { GithubLogoSvg } from '../components/svg/github-logo-svg'
import { LimitPageSvg } from '../components/svg/limit-page-svg'
import { monadTestnet } from '../constants/monad-testnet-chain'
import { ConnectButton } from '../components/button/connect-button'
import { UserButton } from '../components/button/user-button'
import { WrongNetworkButton } from '../components/button/wrong-network-button'
import { UserTransactionsModal } from '../components/modal/user-transactions-modal'
import { useTransactionContext } from '../contexts/transaction-context'

const HeaderContainer = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const router = useRouter()
  const { selectedChain, setSelectedChain } = useChainContext()
  const { chainId, address, status, connector } = useAccount()
  const { openChainModal } = useChainModal()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { disconnectAsync } = useDisconnect()
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
        <div className="flex items-center gap-2.5 md:gap-16">
          {router.pathname.includes('/future') ? (
            <Link
              className="flex gap-2 items-center"
              target="_blank"
              href="https://alpha.clober.io/future?chain=10143"
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
          <div className="hidden lg:flex py-1 justify-start items-center gap-8">
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
              Vault
            </PageButton>

            {selectedChain.id === monadTestnet.id && (
              <PageButton
                disabled={router.pathname.includes('/future')}
                onClick={() => {
                  router.push(`/future?chain=${monadTestnet.id}`)
                }}
              >
                <LimitPageSvg className="w-4 h-4" />
                Futures
              </PageButton>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-auto md:gap-4 ml-auto">
          <div className="hidden lg:flex items-center justify-center mr-2 gap-4">
            <Link
              className="link"
              target="_blank"
              href="https://github.com/clober-dex/"
              rel="noreferrer"
            >
              <GithubLogoSvg className="w-5 h-5" />
            </Link>
            <Link
              className="link"
              target="_blank"
              href="https://docs.clober.io/"
              rel="noreferrer"
            >
              <DocsIconSvg className="w-5 h-5" />
            </Link>
            <Link
              className="link"
              target="_blank"
              href="https://discord.gg/clober-dex"
              rel="noreferrer"
            >
              <DiscordLogoSvg className="w-5 h-5" />
            </Link>
            <Link
              className="link"
              target="_blank"
              href="https://x.com/CloberDEX"
              rel="noreferrer"
            >
              <TwitterLogoSvg className="w-5 h-5" />
            </Link>
          </div>
          {supportChains.length > 1 ? (
            <ChainSelector
              chain={selectedChain}
              setChain={setSelectedChain}
              chains={supportChains}
            />
          ) : (
            <></>
          )}
          <div className="flex items-center">
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
            className="w-8 h-8 lg:hover:bg-gray-200 hover:bg-gray-700 rounded sm:rounded-lg flex items-center justify-center lg:hidden"
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
