import React from 'react'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { Tooltip } from 'react-tooltip'
import { useQuery } from '@tanstack/react-query'

import { useVaultContext } from '../../contexts/vault/vault-context'
import { useChainContext } from '../../contexts/chain-context'
import { toCommaSeparated } from '../../utils/number'
import { QuestionMarkSvg } from '../../components/svg/question-mark-svg'
import { fetchVaults } from '../../apis/vault'
import { useCurrencyContext } from '../../contexts/currency-context'
import { VaultPositionCard } from '../../components/card/vault-position-card'
import { formatUnits } from '../../utils/bigint'
import { VaultCard } from '../../components/card/vault-card'

export const VaultContainer = () => {
  const router = useRouter()
  const { address: userAddress } = useAccount()
  const { vaultLpBalances } = useVaultContext()
  const { selectedChain } = useChainContext()
  const { prices } = useCurrencyContext()

  const [tab, setTab] = React.useState<'my-liquidity' | 'vault'>('vault')

  const { data: vaults } = useQuery({
    queryKey: ['vaults', selectedChain.id, Object.keys(prices).length !== 0],
    queryFn: async () => {
      return fetchVaults(selectedChain, prices)
    },
    initialData: [],
  })

  return (
    <div className="w-full flex flex-col text-white mb-4">
      <div className="flex justify-center w-auto sm:h-[400px]">
        <div className="w-[960px] mt-8 sm:mt-16 flex flex-col sm:gap-12 items-center">
          <div className="flex w-full h-12 sm:h-[72px] flex-col justify-start items-center gap-2 sm:gap-3">
            <div className="self-stretch text-center text-white text-lg sm:text-4xl font-bold">
              Clober Liquidity Vault (CLV)
            </div>
            <div className="self-stretch text-center text-gray-400 text-xs sm:text-sm font-bold">
              Provide liquidity and earn fees!
            </div>
          </div>
          <div className="flex w-full h-20 mt-6 sm:mt-0 sm:h-28 px-4 justify-start items-center gap-3 sm:gap-4">
            <div className="grow shrink basis-0 h-full px-6 py-4 sm:px-8 sm:py-6 bg-[rgba(96,165,250,0.10)] rounded-xl sm:rounded-2xl flex-col justify-center items-center gap-3 inline-flex bg-gray-800">
              <div className="text-center text-gray-400 text-sm font-semibold">
                TVL
              </div>
              <div className="self-stretch text-center text-white text-lg sm:text-2xl font-bold">
                $
                {toCommaSeparated(
                  vaults.reduce((acc, vault) => acc + vault.tvl, 0).toFixed(2),
                )}
              </div>
            </div>
            <div className="grow shrink basis-0 h-full px-6 py-4 sm:px-8 sm:py-6 bg-[rgba(96,165,250,0.10)] rounded-xl sm:rounded-2xl flex-col justify-center items-center gap-3 inline-flex bg-gray-800">
              <div className="text-center text-gray-400 text-sm font-semibold">
                24h Volume
              </div>
              <div className="self-stretch text-center text-white text-lg sm:text-2xl font-bold">
                $
                {toCommaSeparated(
                  vaults
                    .reduce((acc, vault) => acc + vault.volume24h, 0)
                    .toFixed(2),
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full mt-8 sm:mt-0 sm:mr-auto px-4">
            <div className="w-full sm:w-[378px] h-[40px] sm:h-[56px] items-center flex">
              <button
                onClick={() => setTab('vault')}
                disabled={tab === 'vault'}
                className="flex flex-1 gap-2 items-center justify-center w-full h-full text-gray-500 disabled:text-white disabled:bg-gray-800 bg-transparent rounded-tl-2xl rounded-tr-2xl"
              >
                <div className="text-center text-sm sm:text-base font-bold">
                  CLV
                </div>
              </button>

              <button
                onClick={() =>
                  userAddress &&
                  Object.entries(vaultLpBalances).filter(
                    ([, amount]) => amount > 0n,
                  ).length > 0 &&
                  setTab('my-liquidity')
                }
                disabled={tab === 'my-liquidity'}
                className="flex flex-1 gap-2 items-center justify-center w-full h-full text-gray-500 disabled:text-white disabled:bg-gray-800 bg-transparent rounded-tl-2xl rounded-tr-2xl"
              >
                <div className="text-center text-sm sm:text-base font-bold">
                  My Vaults
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center mt-6 px-4 lg:px-0 gap-4 sm:gap-8">
        <div className={`flex flex-col w-full lg:w-[1060px] h-full gap-6`}>
          {tab === 'vault' ? (
            <>
              <div className="hidden lg:flex self-stretch px-4 justify-start items-center gap-4">
                <div className="w-72 text-gray-400 text-sm font-semibold">
                  Liquidity Vault
                </div>
                <div className="flex flex-row gap-2 w-[120px] text-gray-400 text-sm font-semibold">
                  APY
                  <div className="flex mr-auto justify-center items-center">
                    <QuestionMarkSvg
                      data-tooltip-id="apy-info"
                      data-tooltip-place="bottom-end"
                      data-tooltip-html={'Annualized Return'}
                      className="w-3 h-3"
                    />
                    <Tooltip
                      id="apy-info"
                      className="max-w-[300px] bg-gray-950 !opacity-100 z-[100]"
                      clickable
                    />
                  </div>
                </div>
                <div className="w-[120px] text-gray-400 text-sm font-semibold">
                  Total Liquidity
                </div>
                <div className="w-[140px] text-gray-400 text-sm font-semibold">
                  24h Volume
                </div>
              </div>

              {vaults.length === 0 && (
                <div
                  role="status"
                  className="flex justify-center items-center mt-16 sm:mt-8 w-full h-full"
                >
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 animate-spin text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}

              <div className="relative flex justify-center w-full h-full lg:h-[360px]">
                <div className="lg:absolute lg:top-0 lg:overflow-x-scroll w-full h-full items-center flex flex-1 flex-col md:grid md:grid-cols-2 lg:flex gap-3">
                  {vaults.map((vault, index) => (
                    <VaultCard
                      chain={selectedChain}
                      key={index}
                      vault={vault}
                      router={router}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : tab === 'my-liquidity' ? (
            <div className="w-full h-full items-center flex flex-1 flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-[18px]">
              {Object.entries(vaultLpBalances)
                .filter(([, amount]) => amount > 0n)
                .map(([vaultKey, amount]) => {
                  const vault = vaults.find((vault) => vault.key === vaultKey)
                  if (!vault) {
                    return <></>
                  }
                  return (
                    <VaultPositionCard
                      chain={selectedChain}
                      key={vault.key}
                      vaultPosition={{
                        vault,
                        amount,
                        value:
                          vault.lpUsdValue *
                          Number(
                            formatUnits(amount, vault.lpCurrency.decimals),
                          ),
                      }}
                      router={router}
                    />
                  )
                })}
            </div>
          ) : (
            <div className="flex flex-col justify-start items-center gap-3 sm:gap-4 mb-4">
              <div className="w-full py-3 sm:py-4 bg-[#1d1f27] sm:bg-[#1c1e27] rounded-xl inline-flex flex-col justify-start items-start gap-3">
                <div className="self-stretch px-4 sm:px-8 inline-flex justify-start items-start gap-1.5 sm:text-sm text-xs">
                  <div className="w-16 flex justify-start items-center gap-2.5 text-gray-400">
                    Rank
                  </div>
                  <div className="flex w-full">
                    <div className="flex flex-1 justify-start items-center gap-2.5">
                      <div className="justify-start text-gray-400">User</div>
                    </div>
                    <div className="flex flex-1 justify-start items-center gap-2.5">
                      <div className="justify-start text-gray-400">Point</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
