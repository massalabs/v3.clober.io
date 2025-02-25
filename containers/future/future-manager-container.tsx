import React, { useState } from 'react'

import { Asset } from '../../model/future/asset'
import { MintFutureAssetForm } from '../../components/form/future/mint-future-asset-form'
import { useCurrencyContext } from '../../contexts/currency-context'

export const FutureManagerContainer = ({ asset }: { asset: Asset }) => {
  const { balances, prices } = useCurrencyContext()
  const [collateralValue, setCollateralValue] = useState('')
  const [borrowValue, setBorrowValue] = useState('')

  return (
    <MintFutureAssetForm
      asset={asset}
      maxBorrowAmount={0n}
      borrowLTV={0}
      collateralValue={collateralValue}
      setCollateralValue={setCollateralValue}
      borrowValue={borrowValue}
      setBorrowValue={setBorrowValue}
      balances={balances}
      prices={prices}
      liquidationPrice={1.12}
      actionButtonProps={{
        disabled: false,
        onClick: () => {},
        text: 'Borrow',
      }}
    />
  )
}
