import { isAddressEqual } from 'viem'

import { Pool } from '../model/pool'

export const findPool = ({
  pools,
  token0,
  token1,
}: {
  pools: Pool[]
  token0: `0x${string}`
  token1: `0x${string}`
}): Pool | null => {
  return (
    pools.find((pool) => {
      return (
        isAddressEqual(pool.currency0.address, token0) &&
        isAddressEqual(pool.currency1.address, token1)
      )
    }) ||
    pools.find((pool) => {
      return (
        isAddressEqual(pool.currency0.address, token1) &&
        isAddressEqual(pool.currency1.address, token0)
      )
    }) ||
    null
  )
}
