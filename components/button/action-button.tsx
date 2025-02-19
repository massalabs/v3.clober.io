import React from 'react'

export type ActionButtonProps = {
  disabled: boolean
  onClick: () => void
  text: string
}

export const ActionButton = ({
  disabled,
  onClick,
  text,
  ...props
}: ActionButtonProps &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center font-bold justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-base sm:text-lg h-12 sm:h-14 disabled:bg-gray-800 disabled:text-gray-500"
      {...props}
    >
      {text}
    </button>
  )
}
