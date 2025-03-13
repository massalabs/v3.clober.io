import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Asset } from '../../model/future/asset'
import { MintFutureAssetForm } from '../../components/form/future/mint-future-asset-form'
import { useCurrencyContext } from '../../contexts/currency-context'
import {
  calculateLiquidationPrice,
  calculateLtv,
  calculateMaxLoanableAmount,
} from '../../utils/ltv'
import { formatUnits } from '../../utils/bigint'
import { useFutureContractContext } from '../../contexts/future/future-contract-context'
import Modal from '../../components/modal/modal'
import { useChainContext } from '../../contexts/chain-context'

export const FutureManagerContainer = ({ asset }: { asset: Asset }) => {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const [fetchingIsMarketClose, setFetchingIsMarketClose] = useState(false)
  const [displayMarketClosedModal, setDisplayMarketClosedModal] =
    useState(false)
  const { balances, prices } = useCurrencyContext()
  const { isMarketClose, borrow } = useFutureContractContext()
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')

  const [debtAmount, collateralAmount, collateralUserBalance] = useMemo(() => {
    return [
      parseUnits(borrowValue || '0', asset.currency.decimals),
      parseUnits(collateralValue || '0', asset.collateral.decimals),
      balances[asset.collateral.address] ?? 0n,
    ]
  }, [
    asset.collateral.address,
    asset.collateral.decimals,
    asset.currency.decimals,
    balances,
    borrowValue,
    collateralValue,
  ])

  const maxBorrowAmount = useMemo(
    () =>
      calculateMaxLoanableAmount(
        asset.currency,
        parseUnits((prices[asset.currency.address] ?? 0).toFixed(18), 18),
        asset.collateral,
        parseUnits((prices[asset.collateral.address] ?? 0).toFixed(18), 18),
        collateralAmount,
        asset.maxLTV,
        asset.ltvPrecision,
      ),
    [
      asset.collateral,
      asset.currency,
      asset.ltvPrecision,
      asset.maxLTV,
      collateralAmount,
      prices,
    ],
  )
  const isDeptSizeLessThanMinDebtSize = useMemo(
    () => asset.minDebt > 0n && debtAmount < asset.minDebt,
    [asset.minDebt, debtAmount],
  )

  return fetchingIsMarketClose ? (
    <Modal
      show
      onClose={() => {}}
      onButtonClick={() => setFetchingIsMarketClose(false)}
    >
      <div className="flex font-bold text-xl mb-4">
        Fetching market status...
      </div>
      <div
        role="status"
        className="flex justify-center items-center w-full h-full"
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
    </Modal>
  ) : displayMarketClosedModal ? (
    <Modal
      show
      onClose={() => {}}
      onButtonClick={() => setDisplayMarketClosedModal(false)}
    >
      <h1 className="flex font-bold text-xl mb-2">Notice</h1>
      <div className="text-sm">
        our price feeds follow the traditional market hours of each asset
        classes and will be available at the following hours:{' '}
        <span>
          <Link
            className="text-blue-500 underline font-bold"
            target="_blank"
            href="https://docs.pyth.network/price-feeds/market-hours"
          >
            [Link]
          </Link>
        </span>
      </div>
    </Modal>
  ) : (
    <MintFutureAssetForm
      asset={asset}
      maxBorrowAmount={maxBorrowAmount}
      borrowLTV={calculateLtv(
        asset.currency,
        prices[asset.currency.address] ?? 0,
        debtAmount,
        asset.collateral,
        prices[asset.collateral.address] ?? 0,
        collateralAmount,
      )}
      collateralValue={collateralValue}
      setCollateralValue={setCollateralValue}
      borrowValue={borrowValue}
      setBorrowValue={setBorrowValue}
      balances={balances}
      prices={prices}
      liquidationPrice={calculateLiquidationPrice(
        asset.currency,
        prices[asset.currency.address] ?? 0,
        asset.collateral,
        prices[asset.collateral.address] ?? 0,
        debtAmount,
        collateralAmount,
        asset.liquidationThreshold,
        asset.ltvPrecision,
      )}
      actionButtonProps={{
        disabled:
          collateralAmount === 0n ||
          debtAmount === 0n ||
          collateralAmount > collateralUserBalance ||
          debtAmount > maxBorrowAmount ||
          isDeptSizeLessThanMinDebtSize,
        onClick: async () => {
          setFetchingIsMarketClose(true)
          const closed = await isMarketClose(asset, debtAmount)
          setFetchingIsMarketClose(false)
          if (closed) {
            setDisplayMarketClosedModal(true)
            return
          }
          const hash = await borrow(asset, collateralAmount, debtAmount)
          if (hash) {
            await router.replace(`/future?chain=${selectedChain.id}`)
          }
        },
        text:
          collateralAmount === 0n
            ? 'Enter collateral amount'
            : debtAmount === 0n
              ? 'Enter loan amount'
              : collateralAmount > collateralUserBalance
                ? `Insufficient ${asset.collateral.symbol} balance`
                : debtAmount > maxBorrowAmount
                  ? 'Not enough collateral'
                  : isDeptSizeLessThanMinDebtSize
                    ? `Remaining debt must be ≥ ${formatUnits(
                        asset.minDebt,
                        asset.currency.decimals,
                        prices[asset.currency.address] ?? 0,
                      )} ${asset.currency.symbol}`
                    : 'Borrow',
      }}
    />
  )
}
