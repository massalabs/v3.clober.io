import { max, min } from './bigint'

const MINIMUM_LIQUIDITY = 1000n

export const getAmountOut = ({
  amountIn,
  reserveIn,
  reserveOut,
}: {
  amountIn: bigint
  reserveIn: bigint
  reserveOut: bigint
}) => {
  const amountInWithFee = amountIn * 997n
  const numerator = amountInWithFee * reserveOut
  const denominator = reserveIn * 1000n + amountInWithFee
  return numerator / denominator
}

export const calculateReceiveLpAmount = ({
  reserve0,
  reserve1,
  amount0,
  amount1,
  totalSupply,
}: {
  reserve0: bigint
  reserve1: bigint
  amount0: bigint
  amount1: bigint
  totalSupply?: bigint
}): bigint => {
  if (reserve0 + reserve0 === 0n) {
    // liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
    return max(
      BigInt(Math.floor(Math.sqrt(Number(amount0 * amount1)))) -
        MINIMUM_LIQUIDITY,
      0n,
    )
  } else {
    return min(
      (amount0 * (totalSupply ?? 0n)) / reserve0,
      (amount1 * (totalSupply ?? 0n)) / reserve1,
    )
  }
}

export const calculateRemoveLpAmount = ({
  reserve0,
  reserve1,
  amount,
  totalSupply,
}: {
  reserve0: bigint
  reserve1: bigint
  amount: bigint
  totalSupply?: bigint
}): {
  amount0: bigint
  amount1: bigint
} => {
  if (totalSupply) {
    return {
      amount0: (amount * reserve0) / totalSupply,
      amount1: (amount * reserve1) / totalSupply,
    }
  } else {
    return { amount0: 0n, amount1: 0n }
  }
}
