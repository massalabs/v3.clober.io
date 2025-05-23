import React, { useCallback, useMemo } from 'react'
import { createPublicClient, getAddress, http } from 'viem'
import { useAccount, useDisconnect, useWalletClient } from 'wagmi'
import { useQuery } from '@tanstack/react-query'

import { ActionButton } from '../components/button/action-button'
import { toCommaSeparated } from '../utils/number'
import { buildTransaction } from '../utils/build-transaction'
import { RPC_URL } from '../constants/rpc-url'
import { useChainContext } from '../contexts/chain-context'
import { sendTransaction } from '../utils/transaction'
import { useTransactionContext } from '../contexts/transaction-context'
import { currentTimestampInSeconds } from '../utils/date'
import { FUTURES_CONTRACT_ADDRESSES } from '../constants/futures/contract-addresses'
import { LeaderBoard } from '../components/leader-board'
import { fetchTradingCompetitionLeaderboard } from '../apis/trading-competition'
import { useCurrencyContext } from '../contexts/currency-context'
import { TradingCompetitionPnl } from '../model/trading-competition-pnl'

const Profit = ({ profit }: { profit: number }) => {
  return (
    <div
      className={`flex flex-1 justify-start items-center ${profit === 0 ? 'text-white' : profit > 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}
    >
      {profit > 0 ? '+' : '-'} ${toCommaSeparated(Math.abs(profit).toFixed(2))}
    </div>
  )
}

export const TradingCompetitionContainer = () => {
  const { setConfirmation, queuePendingTransaction } = useTransactionContext()
  const { disconnectAsync } = useDisconnect()
  const { data: walletClient } = useWalletClient()
  const { address: userAddress } = useAccount()
  const { selectedChain } = useChainContext()
  const { prices } = useCurrencyContext()

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: selectedChain,
      transport: http(RPC_URL[selectedChain.id]),
    })
  }, [selectedChain])

  const { data } = useQuery({
    queryKey: [
      'trading-competition-leader-board',
      selectedChain.id,
      userAddress,
      Object.keys(prices).length !== 0,
    ],
    queryFn: async () => {
      return fetchTradingCompetitionLeaderboard(
        selectedChain.id,
        prices,
        userAddress,
      )
    },
  }) as {
    data: {
      userPnL: TradingCompetitionPnl
      allUsersPnL: {
        [user: `0x${string}`]: TradingCompetitionPnl
      }
    }
  }

  const register = useCallback(async () => {
    try {
      if (!walletClient) {
        return
      }

      const confirmation = {
        title: `Register for Trading Competition`,
        body: 'Please confirm in your wallet.',
        chain: selectedChain,
        fields: [],
      }
      setConfirmation(confirmation)

      const transaction = await buildTransaction(
        publicClient,
        {
          chain: selectedChain,
          address:
            FUTURES_CONTRACT_ADDRESSES[selectedChain.id]!
              .TradingCompetitionRegistration,
          abi: [
            {
              type: 'function',
              name: 'register',
              inputs: [
                { name: 'metadata', type: 'string', internalType: 'string' },
              ],
              outputs: [],
              stateMutability: 'nonpayable',
            },
          ] as const,
          functionName: 'register',
          args: [''], // TODO: set metadata
        },
        1_000_000n,
      )
      const transactionReceipt = await sendTransaction(
        selectedChain,
        walletClient,
        transaction,
        disconnectAsync,
      )
      if (transactionReceipt) {
        queuePendingTransaction({
          ...confirmation,
          txHash: transactionReceipt.transactionHash,
          success: transactionReceipt.status === 'success',
          blockNumber: Number(transactionReceipt.blockNumber),
          type: 'register',
          timestamp: currentTimestampInSeconds(),
        })
      }
    } catch (error) {
      console.error('Error registering for trading competition:', error)
    } finally {
      setConfirmation(undefined)
    }
  }, [
    disconnectAsync,
    publicClient,
    queuePendingTransaction,
    selectedChain,
    setConfirmation,
    walletClient,
  ])

  return (
    <div className="w-full flex flex-col text-white mb-4 mt-2 px-4">
      <div className="flex flex-col gap-3 lg:gap-7 w-full text-center justify-center items-center text-white text-base font-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="81"
          height="80"
          viewBox="0 0 81 80"
          fill="none"
          className="hidden lg:flex"
        >
          <path
            d="M30.5497 53.467C29.6708 53.467 28.7582 53.1286 28.0822 52.4517C26.7301 51.0979 26.7301 48.8641 28.0822 47.5103L45.2872 30.2831C46.6393 28.9293 48.8702 28.9293 50.2222 30.2831C51.5743 31.6369 51.5743 33.8707 50.2222 35.2245L33.0172 52.4517C32.3412 53.1286 31.4285 53.467 30.5497 53.467Z"
            fill="white"
          />
          <path
            d="M75.7086 52.0121L63.3035 39.591C63.1344 39.4217 62.9654 39.2864 62.8302 39.1171L57.5572 44.1262C57.7262 44.2616 57.8952 44.4308 58.0642 44.5662L70.5708 57.0889C72.3623 58.8827 73.2411 61.218 73.2411 63.5533C73.2411 65.8886 72.3623 68.2578 70.5708 70.0516C66.9878 73.6392 61.2078 73.6392 57.6248 70.0516L45.2196 57.6304C45.152 57.5627 45.0844 57.4612 44.983 57.3935L44.2393 56.6489L39.6085 62.3011C39.7437 62.4703 39.9127 62.6395 40.0817 62.7749L52.4869 75.196C58.8754 81.5928 69.3201 81.5928 75.7086 75.196C82.0972 68.867 82.0972 58.4427 75.7086 52.0121Z"
            fill="white"
          />
          <path
            d="M23.587 36.0028C23.3166 35.7997 23.0799 35.5628 22.8433 35.3259L10.4381 22.9047C8.64665 21.1109 7.76781 18.7756 7.76781 16.4403C7.76781 14.105 8.64665 11.7358 10.4381 9.94201C14.0211 6.35442 19.8012 6.35442 23.3842 9.94201L35.7894 22.3632C35.857 22.4309 35.9246 22.5324 36.026 22.6001L36.9724 23.5478L42.0765 18.4371C41.7384 17.9972 41.3666 17.591 40.961 17.1849L28.522 4.79755C22.1335 -1.59918 11.6888 -1.59918 5.30029 4.79755C-1.08822 11.1943 -1.08822 21.6524 5.30029 28.0492L17.7055 40.4703C18.1111 40.8765 18.5167 41.2488 18.9561 41.5872L24.0602 36.4766L23.587 36.0028Z"
            fill="white"
          />
          <path
            opacity="0.9"
            d="M70.368 46.6637L65.1963 51.8082L57.5909 44.193L62.7288 39.0147L70.368 46.6637Z"
            fill="url(#paint0_linear_1885_7652)"
          />
          <path
            opacity="0.9"
            d="M52.2503 64.7713L47.1124 69.9157L39.5071 62.1875L44.6449 57L52.2503 64.7713Z"
            fill="url(#paint1_linear_1885_7652)"
          />
          <path
            opacity="0.9"
            d="M10.7759 33.5314L15.9137 28.3531L23.6881 36.1375L18.5164 41.2819L10.7759 33.5314Z"
            fill="url(#paint2_linear_1885_7652)"
          />
          <path
            opacity="0.9"
            d="M28.8256 15.4261L33.9972 10.2817L41.7378 17.9375L36.5999 23.2105L28.8256 15.4261Z"
            fill="url(#paint3_linear_1885_7652)"
          />
          <path
            d="M35.8227 57.5945L23.4175 70.0157C19.8345 73.6032 14.0545 73.6032 10.4715 70.0157C8.7476 68.2896 7.80115 65.9881 7.80115 63.5174C7.80115 61.0467 8.7476 58.7791 10.4715 57.053L22.8767 44.6318C22.9781 44.5303 23.0795 44.4287 23.2147 44.3272L32.5439 34.9859C31.4961 34.7829 30.4482 34.6813 29.3328 34.6813C24.9386 34.6813 20.8148 36.4074 17.705 39.4873L5.29983 51.9085C2.19008 55.0223 0.5 59.1514 0.5 63.5512C0.5 67.9511 2.22388 72.0802 5.29983 75.194C8.51098 78.4093 12.7024 80 16.8938 80C21.0852 80 25.3104 78.4093 28.5215 75.194L40.9267 62.7728C44.0365 59.6591 45.7266 55.5299 45.7266 51.1301C45.7266 50.0132 45.6252 48.9301 45.4224 47.8809L36.4311 56.8838C36.2621 57.1207 36.0593 57.3576 35.8227 57.5945Z"
            fill="white"
          />
          <path
            d="M75.3706 5.03333C68.9821 -1.3634 58.5374 -1.3634 52.1489 5.03333L39.7437 17.4545C35.7213 21.4482 34.234 27.0665 35.2819 32.2787L44.2393 23.3435C44.4421 23.0728 44.6787 22.8359 44.9153 22.599L57.2867 10.1778C59.0782 8.384 61.4105 7.50402 63.7428 7.50402C66.0751 7.50402 68.4412 8.384 70.2327 10.1778C73.8157 13.7654 73.8157 19.5529 70.2327 23.1405L57.8275 35.5278C57.7599 35.5955 57.6585 35.6632 57.5909 35.7647L48.1941 45.1737C49.2419 45.3767 50.3236 45.4783 51.3714 45.4783C55.5628 45.4783 59.788 43.8875 62.9992 40.6723L75.4044 28.2511C81.7929 21.8544 81.7929 11.4301 75.3706 5.03333Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1885_7652"
              x1="67.7663"
              y1="49.2396"
              x2="60.1375"
              y2="41.6205"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1885_7652"
              x1="49.6902"
              y1="67.3395"
              x2="42.0613"
              y2="59.7203"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.592157" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1885_7652"
              x1="13.4409"
              y1="30.9617"
              x2="21.2004"
              y2="38.7109"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_1885_7652"
              x1="31.3573"
              y1="12.8465"
              x2="39.1171"
              y2="20.5961"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="49"
          height="48"
          viewBox="0 0 49 48"
          fill="none"
          className="flex lg:hidden"
        >
          <path
            d="M18.5298 32.0801C18.0025 32.0801 17.4549 31.877 17.0493 31.4709C16.238 30.6586 16.238 29.3183 17.0493 28.5061L27.3723 18.1698C28.1835 17.3575 29.5221 17.3575 30.3333 18.1698C31.1446 18.982 31.1446 20.3223 30.3333 21.1346L20.0103 31.4709C19.6047 31.877 19.0571 32.0801 18.5298 32.0801Z"
            fill="white"
          />
          <path
            d="M45.6252 31.2072L38.1821 23.7545C38.0807 23.653 37.9793 23.5718 37.8982 23.4702L34.7343 26.4757C34.8358 26.5569 34.9372 26.6584 35.0386 26.7397L42.5425 34.2533C43.6174 35.3296 44.1447 36.7307 44.1447 38.1319C44.1447 39.5331 43.6174 40.9546 42.5425 42.0309C40.3927 44.1834 36.9247 44.1834 34.7749 42.0309L27.3318 34.5782C27.2912 34.5376 27.2507 34.4767 27.1898 34.436L26.7436 33.9893L23.9651 37.3806C24.0463 37.4821 24.1477 37.5836 24.2491 37.6649L31.6922 45.1176C35.5253 48.9556 41.7921 48.9556 45.6252 45.1176C49.4583 41.3201 49.4583 35.0656 45.6252 31.2072Z"
            fill="white"
          />
          <path
            d="M14.3522 21.6017C14.19 21.4798 14.048 21.3377 13.906 21.1955L6.46291 13.7428C5.38802 12.6665 4.86071 11.2654 4.86071 9.86416C4.86071 8.46298 5.38802 7.04148 6.46291 5.96521C8.61269 3.81265 12.0807 3.81265 14.2305 5.96521L21.6736 13.4179C21.7142 13.4585 21.7548 13.5194 21.8156 13.5601L22.3835 14.1287L25.4459 11.0623C25.2431 10.7983 25.02 10.5546 24.7766 10.3109L17.3132 2.87853C13.4801 -0.95951 7.2133 -0.95951 3.3802 2.87853C-0.452905 6.71657 -0.452905 12.9915 3.3802 16.8295L10.8233 24.2822C11.0667 24.5259 11.3101 24.7493 11.5737 24.9523L14.6361 21.886L14.3522 21.6017Z"
            fill="white"
          />
          <path
            opacity="0.9"
            d="M42.4207 27.9983L39.3177 31.085L34.7545 26.5159L37.8372 23.4089L42.4207 27.9983Z"
            fill="url(#paint0_linear_1885_8232)"
          />
          <path
            opacity="0.9"
            d="M31.5502 38.8627L28.4675 41.9494L23.9042 37.3124L26.9869 34.2L31.5502 38.8627Z"
            fill="url(#paint1_linear_1885_8232)"
          />
          <path
            opacity="0.9"
            d="M6.66553 20.1189L9.74823 17.012L14.4129 21.6826L11.3099 24.7693L6.66553 20.1189Z"
            fill="url(#paint2_linear_1885_8232)"
          />
          <path
            opacity="0.9"
            d="M17.4953 9.25562L20.5983 6.16895L25.2426 10.7625L22.1599 13.9263L17.4953 9.25562Z"
            fill="url(#paint3_linear_1885_8232)"
          />
          <path
            d="M21.6936 34.5567L14.2505 42.0094C12.1007 44.162 8.63267 44.162 6.48289 42.0094C5.44856 40.9738 4.88069 39.5929 4.88069 38.1105C4.88069 36.6281 5.44856 35.2675 6.48289 34.2318L13.926 26.7791C13.9868 26.7182 14.0477 26.6573 14.1288 26.5964L19.7264 20.9916C19.0977 20.8698 18.4689 20.8088 17.7997 20.8088C15.1631 20.8088 12.6889 21.8445 10.823 23.6924L3.3799 31.1451C1.51405 33.0134 0.5 35.4909 0.5 38.1308C0.5 40.7707 1.53433 43.2482 3.3799 45.1164C5.30659 47.0456 7.82143 48 10.3363 48C12.8511 48 15.3862 47.0456 17.3129 45.1164L24.756 37.6637C26.6219 35.7955 27.6359 33.318 27.6359 30.6781C27.6359 30.0079 27.5751 29.3581 27.4534 28.7286L22.0587 34.1303C21.9573 34.2724 21.8356 34.4146 21.6936 34.5567Z"
            fill="white"
          />
          <path
            d="M45.4223 3.01989C41.5892 -0.818152 35.3224 -0.818152 31.4893 3.01989L24.0462 10.4726C21.6327 12.8688 20.7404 16.2398 21.3691 19.3671L26.7435 14.006C26.8652 13.8436 27.0072 13.7014 27.1492 13.5593L34.572 6.10656C35.6469 5.03029 37.0463 4.5023 38.4457 4.5023C39.8451 4.5023 41.2647 5.03029 42.3396 6.10656C44.4894 8.25911 44.4894 11.7316 42.3396 13.8842L34.8965 21.3166C34.8559 21.3572 34.7951 21.3978 34.7545 21.4587L29.1164 27.1041C29.7451 27.2259 30.3941 27.2868 31.0228 27.2868C33.5377 27.2868 36.0728 26.3324 37.9995 24.4032L45.4426 16.9505C49.2757 13.1125 49.2757 6.85792 45.4223 3.01989Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1885_8232"
              x1="40.8598"
              y1="29.5439"
              x2="36.2824"
              y2="24.9724"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1885_8232"
              x1="30.0141"
              y1="40.4036"
              x2="25.4368"
              y2="35.8321"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.592157" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1885_8232"
              x1="8.26456"
              y1="18.5771"
              x2="12.9202"
              y2="23.2267"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_1885_8232"
              x1="19.0143"
              y1="7.70782"
              x2="23.6702"
              y2="12.3576"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="#5F6F97" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
        Clober Trading Competition
      </div>

      <div className="flex w-full justify-center mt-8 lg:mt-10">
        <div className="flex text-base lg:text-lg w-full sm:w-[410px]">
          <ActionButton disabled={false} onClick={register} text="Register" />
        </div>
      </div>

      <div className="w-full lg:flex lg:justify-center">
        <div className="flex flex-col items-center gap-3 sm:gap-4 mt-12 mb-4 lg:w-[616px]">
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
                  <div className="justify-start text-gray-400">
                    Unrealized Profit
                  </div>
                </div>
              </div>
            </div>
          </div>

          <LeaderBoard
            myValue={
              userAddress && (data?.userPnL?.totalPnl ?? 0) !== 0
                ? {
                    address: userAddress,
                    value: <Profit profit={data?.userPnL?.totalPnl ?? 0} />,
                  }
                : undefined
            }
            values={Object.entries(data?.allUsersPnL ?? {})
              .sort(([, a], [, b]) => b.totalPnl - a.totalPnl)
              .slice(0, 100)
              .map(([address, { totalPnl }], index) => ({
                address: getAddress(address),
                value: <Profit profit={totalPnl} />,
                rank: index + 1,
              }))}
          />
        </div>
      </div>
    </div>
  )
}
