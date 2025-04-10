import React from 'react'
import { useAccount } from 'wagmi'
import { isAddressEqual } from 'viem'

import { usePointContext } from '../contexts/point-context'
import { shortAddress } from '../utils/address'
import { toCommaSeparated } from '../utils/number'

export const PointContainer = () => {
  const { address: userAddress } = useAccount()
  const { myVaultPoint, vaultPoints } = usePointContext()

  return (
    <div className="w-full flex flex-col text-white mb-4">
      <div className="flex justify-center w-auto">
        <div className="w-[960px] mt-8 flex flex-col sm:gap-12 items-center">
          <div className="flex w-full h-12 sm:h-[72px] flex-col justify-start items-center gap-2 sm:gap-3">
            <div className="self-stretch text-center text-white text-lg sm:text-4xl font-bold">
              Clober Point
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center mt-6 px-4 lg:px-0 gap-4 sm:gap-8">
        <div className="flex flex-col w-full lg:w-[960px] h-full gap-6">
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

            <div className="self-stretch w-full flex flex-col justify-start items-start gap-1 sm:gap-2 overflow-y-scroll max-h-[500px]">
              {userAddress && vaultPoints.length > 0 && myVaultPoint && (
                <div className="self-stretch px-4 sm:px-8 min-h-10 bg-[#75b3ff]/20 flex rounded-lg justify-center items-center gap-1.5 sm:text-sm text-xs">
                  <div className="w-16 flex justify-start items-center gap-2.5 text-white font-bold">
                    {vaultPoints.find((rank) =>
                      isAddressEqual(rank.userAddress, userAddress),
                    )?.rank ?? '-'}
                  </div>
                  <div className="flex w-full">
                    <div className="flex flex-1 justify-start text-blue-400 gap-1">
                      Me
                      <span className="hidden sm:flex">
                        ({shortAddress(userAddress, 6)})
                      </span>
                    </div>
                    <div className="flex flex-1 justify-start text-white font-semibold">
                      {toCommaSeparated(myVaultPoint.point.toFixed(2))}
                    </div>
                  </div>
                </div>
              )}

              {vaultPoints
                .filter((rank) => rank.point >= 0.01)
                .slice(0, 100)
                .map(({ userAddress, point, rank }, index) => (
                  <div
                    key={`vault-liquidity-point-rank-${userAddress}`}
                    className={`self-stretch px-4 sm:px-8 min-h-10 ${rank === 1 ? 'bg-[#ffce50]/20' : rank === 2 ? 'bg-[#d0d6ec]/20' : rank === 3 ? 'bg-[#ffc581]/20' : 'bg-gray-900'} flex rounded-lg justify-center items-center gap-1.5 sm:text-sm text-xs`}
                  >
                    <div
                      className={`${rank === 1 ? 'text-[#ffe607]' : rank === 2 ? 'text-[#e4e5f5]' : rank === 3 ? 'text-[#ffc038]' : 'text-white'} w-16 flex justify-start items-center gap-2.5 text-white font-bold`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex w-full">
                      <div className="flex flex-1 justify-start text-white gap-1">
                        <span className="flex sm:hidden">
                          {shortAddress(userAddress, 2)}
                        </span>
                        <span className="hidden sm:flex">
                          {shortAddress(userAddress, 8)}
                        </span>
                      </div>
                      <div className="flex flex-1 justify-start text-white font-semibold">
                        {toCommaSeparated(point.toFixed(2))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
