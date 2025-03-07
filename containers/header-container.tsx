import React from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'

import { useChainContext } from '../contexts/chain-context'
import ChainSelector from '../components/selector/chain-selector'
import { WalletSelector } from '../components/selector/wallet-selector'
import { supportChains } from '../constants/chain'
import MenuSvg from '../components/svg/menu-svg'
import { DocsIconSvg } from '../components/svg/docs-icon-svg'
import { DiscordLogoSvg } from '../components/svg/discord-logo-svg'
import { TwitterLogoSvg } from '../components/svg/twitter-logo-svg'
import { PageButton } from '../components/button/page-button'
import { SwapPageSvg } from '../components/svg/swap-page-svg'
import { VaultPageSvg } from '../components/svg/vault-page-svg'
import { GithubLogoSvg } from '../components/svg/github-logo-svg'

const HeaderContainer = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const router = useRouter()
  const { selectedChain, setSelectedChain } = useChainContext()
  const { address, status, connector } = useAccount()

  return (
    <div className="flex items-center justify-between h-[46px] md:h-[60px] py-0 px-4">
      <div className="flex items-center gap-2.5 md:gap-16">
        {window.location.href.includes('futures.clober.io') ? (
          <Link
            className="flex gap-2 items-center"
            target="_blank"
            href="https://futures.clober.io"
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
        {!window.location.href.includes('futures.clober.io') ? (
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
          </div>
        ) : (
          <></>
        )}
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
        <WalletSelector
          address={address}
          status={status}
          connector={connector}
        />
        <button
          className="w-8 h-8 lg:hover:bg-gray-200 hover:bg-gray-700 rounded sm:rounded-lg flex items-center justify-center lg:hidden"
          onClick={onMenuClick}
        >
          <MenuSvg />
        </button>
      </div>
    </div>
  )
}

export default HeaderContainer
