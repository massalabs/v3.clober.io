import { Asset } from '../model/future/asset'

export const getLTVTextColor = (ltv: number, asset: Asset): string => {
  const liquidationThreshold =
    (Number(asset.liquidationThreshold) * 100) / Number(asset.ltvPrecision)
  const maxLTV = (Number(asset.maxLTV) * 100) / Number(asset.ltvPrecision)

  if (asset.liquidationThreshold === 0n) {
    return ''
  }

  if (ltv >= liquidationThreshold - 0.5) {
    return 'text-red-500'
  } else if (liquidationThreshold - 0.5 > ltv && ltv > maxLTV) {
    return 'text-yellow-500'
  }
  return 'text-green-500'
}
