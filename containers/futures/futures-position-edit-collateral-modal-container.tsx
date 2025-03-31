import React, { useMemo, useState } from 'react'
import { parseUnits } from 'viem'

import { UserPosition } from '../../model/futures/user-position'
import { useCurrencyContext } from '../../contexts/currency-context'
import { calculateLtv, calculateMinCollateralAmount } from '../../utils/ltv'
import { max } from '../../utils/bigint'
import { FuturesPositionEditCollateralModal } from '../../components/modal/futures-position-edit-collateral-modal'

export const FuturesPositionEditCollateralModalContainer = ({
  userPosition,
  onClose,
}: {
  userPosition: UserPosition
  onClose: () => void
}) => {
  const { prices, balances } = useCurrencyContext()

  const [value, setValue] = useState('')
  const [isWithdrawCollateral, setIsWithdrawCollateral] = useState(false)

  const [amount, minCollateralAmount] = useMemo(
    () => [
      parseUnits(value, userPosition.asset.collateral.decimals),
      calculateMinCollateralAmount(
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
        userPosition?.debtAmount ?? 0n,
        userPosition.asset.maxLTV,
        userPosition.asset.ltvPrecision,
      ),
    ],
    [
      prices,
      userPosition.asset.collateral,
      userPosition.asset.currency,
      userPosition.asset.ltvPrecision,
      userPosition.asset.maxLTV,
      userPosition?.debtAmount,
      value,
    ],
  )

  const availableCollateralAmount = useMemo(
    () =>
      isWithdrawCollateral
        ? max((userPosition?.collateralAmount ?? 0n) - minCollateralAmount, 0n)
        : (balances[userPosition.asset.collateral.address] ?? 0n),
    [
      balances,
      isWithdrawCollateral,
      minCollateralAmount,
      userPosition.asset.collateral.address,
      userPosition?.collateralAmount,
    ],
  )

  return (
    <FuturesPositionEditCollateralModal
      asset={userPosition.asset}
      onClose={onClose}
      value={value}
      setValue={setValue}
      isWithdrawCollateral={isWithdrawCollateral}
      setIsWithdrawCollateral={setIsWithdrawCollateral}
      availableCollateralAmount={
        isWithdrawCollateral
          ? max((userPosition.collateralAmount ?? 0n) - minCollateralAmount, 0n)
          : (balances[userPosition.asset.collateral.address] ?? 0n)
      }
      ltv={calculateLtv(
        userPosition.asset.currency,
        prices[userPosition.asset.currency.address] ?? 0,
        userPosition?.debtAmount ?? 0n,
        userPosition.asset.collateral,
        prices[userPosition.asset.collateral.address] ?? 0,
        userPosition?.collateralAmount ?? 0n,
      )}
      newLTV={calculateLtv(
        userPosition.asset.currency,
        prices[userPosition.asset.currency.address] ?? 0,
        userPosition?.debtAmount ?? 0n,
        userPosition.asset.collateral,
        prices[userPosition.asset.collateral.address] ?? 0,
        (userPosition?.collateralAmount ?? 0n) +
          (isWithdrawCollateral ? -amount : amount),
      )}
      actionButtonProps={{
        disabled: amount === 0n || amount > availableCollateralAmount,
        onClick: async () => {
          // isWithdrawCollateral
          //   ? await removeCollateral(position, amount)
          //   : await addCollateral(position, amount)
          setValue('')
          onClose()
        },
        text:
          amount === 0n
            ? 'Enter collateral amount'
            : !isWithdrawCollateral && amount > availableCollateralAmount
              ? `Insufficient ${userPosition.asset.collateral.symbol} balance`
              : isWithdrawCollateral && amount > availableCollateralAmount
                ? 'Not enough collateral'
                : 'Edit Collateral',
      }}
      collateralPrice={prices[userPosition.asset.collateral.address] ?? 0}
    />
  )
}
