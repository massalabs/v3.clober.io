import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { Asset } from '../../model/future/asset'
import { MintFutureAssetForm } from '../../components/form/future/mint-future-asset-form'
import { useCurrencyContext } from '../../contexts/currency-context'
import {
  calculateLiquidationPrice,
  calculateLtv,
  calculateMaxLoanableAmount,
} from '../../utils/ltv'

export const FutureManagerContainer = ({ asset }: { asset: Asset }) => {
  const { balances, prices } = useCurrencyContext()
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')

  const [debtAmount, collateralAmount] = useMemo(() => {
    return [
      parseUnits(borrowValue || '0', asset.currency.decimals),
      parseUnits(collateralValue || '0', asset.collateral.decimals),
    ]
  }, [
    asset.collateral.decimals,
    asset.currency.decimals,
    borrowValue,
    collateralValue,
  ])

  return (
    <MintFutureAssetForm
      asset={asset}
      maxBorrowAmount={calculateMaxLoanableAmount(
        asset.currency,
        parseUnits((prices[asset.currency.address] ?? 0).toFixed(18), 18),
        asset.collateral,
        parseUnits((prices[asset.collateral.address] ?? 0).toFixed(18), 18),
        collateralAmount,
        asset.maxLTV,
        asset.ltvPrecision,
      )}
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
        disabled: false,
        onClick: () => {},
        text: 'Borrow',
      }}
    />
  )
}
