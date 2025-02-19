import React, { useEffect } from 'react'

export const Toast = ({
  isCopyToast,
  setIsCopyToast,
  durationInMs,
  children,
}: {
  isCopyToast: boolean
  setIsCopyToast: (isCopyToast: boolean) => void
  durationInMs: number
} & React.PropsWithChildren<{}>) => {
  useEffect(() => {
    if (isCopyToast) {
      const timer = setTimeout(() => {
        setIsCopyToast(false)
      }, durationInMs)
      return () => clearTimeout(timer)
    }
  }, [durationInMs, isCopyToast, setIsCopyToast])

  return isCopyToast ? (
    <div className="z-[10000] fixed bottom-4 lg:bottom-12 -translate-x-1/2 left-1/2 h-9 px-3 py-2 bg-[#edf1ff]/10 rounded-[18px] backdrop-blur-lg justify-start items-center gap-1.5 flex">
      {children}
    </div>
  ) : (
    <></>
  )
}
