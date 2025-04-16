export type LiquidityVaultPoint = {
  userAddress: `0x${string}`
  vaultBalances: {
    vaultKey: `0x${string}`
    balance: number
  }[]
  point: number
}
