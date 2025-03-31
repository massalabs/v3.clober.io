import React from 'react'

import Modal from '../../components/modal/modal'
import { getLTVTextColor } from '../../utils/ltv'
import { Asset } from '../../model/futures/asset'
import { ArrowSvg } from '../svg/arrow-svg'
import { ActionButton, ActionButtonProps } from '../button/action-button'
import CurrencyAmountInput from '../input/currency-amount-input'

export const FuturesPositionEditCollateralModal = ({
  asset,
  onClose,
  value,
  setValue,
  isWithdrawCollateral,
  setIsWithdrawCollateral,
  availableCollateralAmount,
  ltv,
  newLTV,
  collateralPrice,
  actionButtonProps,
}: {
  asset: Asset
  onClose: () => void
  value: string
  setValue: (value: string) => void
  isWithdrawCollateral: boolean
  setIsWithdrawCollateral: (value: boolean) => void
  availableCollateralAmount: bigint
  ltv: number
  newLTV: number
  collateralPrice: number
  actionButtonProps: ActionButtonProps
}) => {
  return (
    <Modal show onClose={onClose}>
      <h1 className="font-bold text-xl mb-6">Add or withdraw collateral</h1>
      <div className="flex mb-6 rounded text-xs bg-gray-800 text-gray-500">
        <button
          className="flex-1 py-2 rounded border-gray-800 disabled:border-blue-500 disabled:text-blue-500 border-[1.5px]"
          disabled={!isWithdrawCollateral}
          onClick={() => setIsWithdrawCollateral(false)}
        >
          Add Collateral
        </button>
        <button
          className="flex-1 py-2 rounded border-gray-800 disabled:border-blue-500 disabled:text-blue-500 border-[1.5px]"
          disabled={isWithdrawCollateral}
          onClick={() => setIsWithdrawCollateral(true)}
        >
          Withdraw Collateral
        </button>
      </div>
      <div className="mb-4">
        <CurrencyAmountInput
          currency={asset.collateral}
          value={value}
          onValueChange={setValue}
          price={collateralPrice}
          availableAmount={availableCollateralAmount}
        />
      </div>
      <div className="flex text-sm gap-3 mb-8">
        <div className="text-gray-500">LTV</div>
        <div className="flex items-center gap-1">
          <span className={`${getLTVTextColor(ltv, asset)}`}>
            {ltv.toFixed(2)}%
          </span>
          {value ? (
            <>
              <ArrowSvg />
              <span className={`${getLTVTextColor(newLTV, asset)}`}>
                {newLTV.toFixed(2)}%
              </span>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <ActionButton {...actionButtonProps} />
    </Modal>
  )
}
