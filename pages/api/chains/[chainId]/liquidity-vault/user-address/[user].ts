import { NextApiRequest, NextApiResponse } from 'next'
import { getAddress, isAddress } from 'viem'

import { fetchLiquidVaultPoint } from '../../../../../../apis/point'
import { currentTimestampInSeconds } from '../../../../../../utils/date'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    // eslint-disable-next-line prefer-const
    let { chainId, user } = query
    if (
      !chainId ||
      !user ||
      typeof chainId !== 'string' ||
      typeof user !== 'string'
    ) {
      res.json({
        status: 'error',
        message:
          'URL should be /api/chains/[chainId]/liquidity-vault/user-address/[user]',
      })
      return
    }
    if (!isAddress(user)) {
      res.json({
        status: 'error',
        message: 'Invalid address',
      })
      return
    }

    const point = await fetchLiquidVaultPoint(Number(chainId), getAddress(user))
    res.json({
      point,
    })
  } catch (error) {
    console.log('fetchTokenInfo error', error)
    res.json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}
