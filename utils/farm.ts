import { CHAIN_IDS, getContractAddresses } from '@clober/v2-sdk'
import { encodeAbiParameters, keccak256 } from 'viem'

export const encodePoolId = ({
  chainId,
  key,
}: {
  chainId: CHAIN_IDS
  key: `0x${string}`
}): bigint => {
  const value = keccak256(
    encodeAbiParameters(
      [
        { name: 'token', type: 'address' },
        { name: 'isMultiToken', type: 'bool' },
        { name: 'tokenId', type: 'uint256' },
      ],
      [getContractAddresses({ chainId }).Rebalancer, true, BigInt(key)],
    ),
  )
  return BigInt(value)
}
