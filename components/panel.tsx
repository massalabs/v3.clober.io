import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { NextRouter } from 'next/router'
import { CHAIN_IDS } from '@clober/v2-sdk'
import { monadTestnet } from 'viem/chains'

import { TwitterLogoSvg } from './svg/twitter-logo-svg'
import { DiscordLogoSvg } from './svg/discord-logo-svg'
import { DocsIconSvg } from './svg/docs-icon-svg'
import { SwapPageSvg } from './svg/swap-page-svg'
import { PageButton } from './button/page-button'
import { VaultPageSvg } from './svg/vault-page-svg'
import { GithubLogoSvg } from './svg/github-logo-svg'
import { LimitPageSvg } from './svg/limit-page-svg'
import { DiscoverPageSvg } from './svg/discover-page-svg'
import { PointPageSvg } from './svg/point-page-svg'

const Panel = ({
  chainId,
  open,
  setOpen,
  router,
}: {
  chainId: CHAIN_IDS
  open: boolean
  setOpen: (open: boolean) => void
  router: NextRouter
} & React.PropsWithChildren) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[10000]" onClose={setOpen}>
        <div className="fixed inset-0 bg-transparent bg-opacity-5 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto max-w-md">
                  <div className="flex h-full flex-col bg-[#171B24] shadow-xl">
                    <div className="flex items-center px-4 h-12 justify-end">
                      <div className="flex items-start">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="relative rounded-md text-gray-400 hover:text-gray-500 outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col text-white text-base font-bold relative mb-6 flex-1 pl-8 pr-16 gap-[40px]">
                      <div className="flex flex-col gap-8 items-start">
                        {chainId === monadTestnet.id && (
                          <PageButton
                            disabled={router.pathname.includes('/discover')}
                            onClick={() => {
                              router.push('/discover')
                              setOpen(false)
                            }}
                          >
                            <DiscoverPageSvg className="w-4 h-4" />
                            Discover
                          </PageButton>
                        )}

                        <PageButton
                          disabled={router.pathname.includes('/trade')}
                          onClick={() => {
                            router.push('/trade')
                            setOpen(false)
                          }}
                        >
                          <SwapPageSvg className="w-4 h-4" />
                          Trade
                        </PageButton>

                        <PageButton
                          disabled={router.pathname.includes('/earn')}
                          onClick={() => {
                            router.push('/earn')
                            setOpen(false)
                          }}
                        >
                          <VaultPageSvg className="w-4 h-4" />
                          Earn
                        </PageButton>

                        {chainId === monadTestnet.id && (
                          <>
                            <PageButton
                              disabled={router.pathname.includes('/point')}
                              onClick={() => {
                                router.push('/point')
                                setOpen(false)
                              }}
                            >
                              <PointPageSvg className="w-4 h-4" />
                              Point
                            </PageButton>

                            <PageButton
                              disabled={router.pathname.includes('/futures')}
                              onClick={() => {
                                router.push('/futures')
                                setOpen(false)
                              }}
                            >
                              <LimitPageSvg className="w-4 h-4" />
                              Futures
                            </PageButton>

                            <PageButton
                              disabled={router.pathname.includes('/analytics')}
                              onClick={() => {
                                router.push('/analytics')
                                setOpen(false)
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

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="192"
                        height="2"
                        viewBox="0 0 192 2"
                        fill="none"
                      >
                        <path
                          d="M0 1H192"
                          strokeWidth="1.5"
                          className="stroke-gray-600"
                        />
                      </svg>
                      <div className="flex flex-col gap-8">
                        <Link
                          className="link"
                          target="_blank"
                          href="https://github.com/clober-dex/"
                          rel="noreferrer"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <GithubLogoSvg className="w-4 h-4" />
                            Github
                          </div>
                        </Link>
                        <Link
                          className="link"
                          target="_blank"
                          href="https://docs.clober.io/"
                          rel="noreferrer"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <DocsIconSvg className="w-4 h-4" />
                            Docs
                          </div>
                        </Link>
                        <Link
                          className="link"
                          target="_blank"
                          href="https://x.com/CloberDEX"
                          rel="noreferrer"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <TwitterLogoSvg className="w-4 h-4" />
                            Twitter
                          </div>
                        </Link>
                        <Link
                          className="link"
                          target="_blank"
                          href="https://discord.gg/clober-dex"
                          rel="noreferrer"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <DiscordLogoSvg className="w-4 h-4" />
                            Discord
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Panel
