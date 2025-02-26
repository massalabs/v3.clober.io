import React, { useEffect, useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { FuturePositionAdjustModal } from '../../components/modal/future-position-adjust-modal'
import { UserPosition } from '../../model/future/user-position'
import { calculateLtv, calculateMaxLoanableAmount } from '../../utils/ltv'
import { useCurrencyContext } from '../../contexts/currency-context'
import { applyPercent } from '../../utils/bigint'

export const FuturePositionAdjustModalContainer = ({
  userPosition,
  onClose,
}: {
  userPosition: UserPosition
  onClose: () => void
}) => {
  const { prices } = useCurrencyContext()

  const ltv = calculateLtv(
    userPosition.asset.currency,
    prices[userPosition.asset.currency.address] ?? 0,
    userPosition.debtAmount,
    userPosition.asset.collateral,
    prices[userPosition.asset.collateral.address] ?? 0,
    userPosition.collateralAmount,
  )
  const [newLTV, setNewLTV] = useState(ltv)
  const [ltvNewBuffer, setLTVNewBuffer] = useState({
    previous: newLTV,
    updateAt: Date.now(),
  })

  const [expectedCollateralAmount, expectedDebtAmount] = useMemo(() => {
    const maxLTV =
      (Number(userPosition.asset.maxLTV) * 100) /
      Number(userPosition.asset.ltvPrecision)
    const maxLoanableAmount = calculateMaxLoanableAmount(
      userPosition.asset.currency,
      parseUnits(
        (prices[userPosition.asset.currency.address] ?? 0).toFixed(18),
        18,
      ),
      userPosition.asset.collateral,
      parseUnits(
        (prices[userPosition.asset.collateral.address] ?? 0).toFixed(18),
        18,
      ),
      userPosition.collateralAmount,
      userPosition.asset.maxLTV,
      userPosition.asset.ltvPrecision,
    )
    if (newLTV !== ltv) {
      return [
        userPosition.collateralAmount,
        applyPercent(maxLoanableAmount, (newLTV * 100) / maxLTV),
      ]
    }
    return [userPosition.collateralAmount, userPosition.debtAmount]
  }, [
    ltv,
    newLTV,
    prices,
    userPosition.asset.collateral,
    userPosition.asset.currency,
    userPosition.asset.ltvPrecision,
    userPosition.asset.maxLTV,
    userPosition.collateralAmount,
    userPosition.debtAmount,
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        Date.now() - ltvNewBuffer.updateAt > 100 &&
        ltvNewBuffer.previous !== newLTV
      ) {
        setLTVNewBuffer({
          previous: newLTV,
          updateAt: Date.now(),
        })
      }
    }, 250)
    return () => clearInterval(interval)
  }, [newLTV, ltvNewBuffer.previous, ltvNewBuffer.updateAt])

  return (
    <FuturePositionAdjustModal
      asset={userPosition.asset}
      onClose={onClose}
      ltv={ltv}
      newLTV={newLTV}
      setNewLTV={setNewLTV}
      currentCollateralAmount={userPosition.collateralAmount}
      expectedCollateralAmount={expectedCollateralAmount}
      currentDebtAmount={userPosition.debtAmount}
      expectedDebtAmount={expectedDebtAmount}
      //
      loanAssetPrice={prices[userPosition.asset.currency.address] ?? 0}
      collateralPrice={prices[userPosition.asset.collateral.address] ?? 0}
      actionButtonProps={{
        onClick: async () => {},
        text: 'Adjust position',
        disabled: false,
      }}
    />
  )
}
