import { NextApiRequest, NextApiResponse } from 'next'

import { WHITELISTED_VAULTS } from '../../../../../constants/vault'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    // eslint-disable-next-line prefer-const
    let { chainId } = query
    if (!chainId || typeof chainId !== 'string') {
      res.json({
        status: 'error',
        message: 'URL should be /api/chains/[chainId]/liquidity-vault',
      })
      return
    }

    res.json({
      vault: WHITELISTED_VAULTS[Number(chainId)],
    })
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}
