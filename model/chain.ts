import { Chain as ViemChain } from 'viem'

export type Chain = ViemChain & {
  icon?: string
}
