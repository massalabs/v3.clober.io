import { NextApiRequest, NextApiResponse } from 'next'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { CHAIN_IDS, getSubgraphEndpoint } from '@clober/v2-sdk'
import { getAddress, isAddressEqual, zeroAddress } from 'viem'

import { Subgraph } from '../../../../../constants/subgraph'
import { formatUnits } from '../../../../../utils/bigint'
import { WHITELISTED_CURRENCIES } from '../../../../../constants/currency'

const getGoogleAnalyticsActiveUsersSnapshot = async (): Promise<
  { timestamp: number; activeUsers: number }[]
> => {
  if (
    !process.env.GOOGLE_ANALYTICS_PROPERTY_ID ||
    !process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL ||
    !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY
  ) {
    throw new Error(
      'GOOGLE_ANALYTICS_PROPERTY_ID, GOOGLE_ANALYTICS_CLIENT_EMAIL, and GOOGLE_ANALYTICS_PRIVATE_KEY are not defined',
    )
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY.replace(
        /\\n/g,
        '\n',
      ),
    },
  })

  const request = {
    property: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
    dateRanges: [
      {
        startDate: '2025-02-14',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'date',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  }
  const [response] = await analyticsDataClient.runReport(request)
  return (response.rows ?? [])
    .map((row) =>
      // 20250323 -> 2025-03-23
      row.dimensionValues?.[0]?.value && row.metricValues?.[0]?.value
        ? {
            timestamp: Math.floor(
              new Date(
                row.dimensionValues[0].value.replace(
                  /(\d{4})(\d{2})(\d{2})/,
                  '$1-$2-$3',
                ),
              ).getTime() / 1000,
            ),
            activeUsers: Number(row.metricValues[0].value),
          }
        : undefined,
    )
    .filter((row): row is { timestamp: number; activeUsers: number } => !!row)
}

const getOnChainSnapshot = async ({
  chainId,
}: {
  chainId: CHAIN_IDS
}): Promise<
  {
    timestamp: number
    transactionCount: number
    walletCount: number
    volumeSnapshots: { symbol: string; amount: number }[]
  }[]
> => {
  const endpoint = getSubgraphEndpoint({ chainId: CHAIN_IDS.MONAD_TESTNET })
  const {
    data: { snapshots },
  } = await Subgraph.get<{
    data: {
      snapshots: {
        id: string
        transactionCount: string
        walletCount: string
        volumeSnapshots: {
          token: {
            id: string
            name: string
            symbol: string
            decimals: string
          }
          amount: string
        }[]
      }[]
    }
  }>(
    endpoint,
    'getOnChainSnapshot',
    '{ snapshots { id transactionCount walletCount volumeSnapshots { token { id name symbol decimals } amount } } }',
    {},
  )
  const nativeCurrency = WHITELISTED_CURRENCIES[chainId].find((currency) =>
    isAddressEqual(currency.address, zeroAddress),
  )
  return nativeCurrency
    ? snapshots
        .map((snapshot) => ({
          timestamp: Number(snapshot.id),
          transactionCount: Number(snapshot.transactionCount),
          walletCount: Number(snapshot.walletCount),
          volumeSnapshots: snapshot.volumeSnapshots
            .map((volumeSnapshot) => ({
              symbol: isAddressEqual(
                volumeSnapshot.token.id as `0x${string}`,
                zeroAddress,
              )
                ? nativeCurrency.symbol
                : volumeSnapshot.token.symbol,
              amount: Number(
                formatUnits(
                  BigInt(volumeSnapshot.amount),
                  Number(volumeSnapshot.token.decimals),
                ),
              ),
              address: getAddress(volumeSnapshot.token.id as `0x${string}`),
            }))
            .filter((volumeSnapshot) => volumeSnapshot.amount > 0),
        }))
        .filter((snapshot) => snapshot.volumeSnapshots.length > 0)
    : []
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const query = req.query
    const { chainId } = query
    if (!chainId || typeof chainId !== 'string') {
      res.json({
        status: 'error',
        message: 'URL should be /api/chains/[chainId]/analytics',
      })
      return
    }

    const [googleAnalyticsActiveUsersSnapshot, onChainSnapshot] =
      await Promise.all([
        getGoogleAnalyticsActiveUsersSnapshot(),
        getOnChainSnapshot({ chainId: chainId as unknown as CHAIN_IDS }),
      ])
    const keys = new Set([
      ...googleAnalyticsActiveUsersSnapshot.map((row) => row.timestamp),
      ...onChainSnapshot.map((row) => row.timestamp),
    ])
    res.json({
      snapshots: Array.from(keys)
        .map((timestamp) => ({
          timestamp,
          googleAnalyticsActiveUsers: googleAnalyticsActiveUsersSnapshot.find(
            (row) => row.timestamp === timestamp,
          )?.activeUsers,
          transactionCount: onChainSnapshot.find(
            (row) => row.timestamp === timestamp,
          )?.transactionCount,
          walletCount: onChainSnapshot.find(
            (row) => row.timestamp === timestamp,
          )?.walletCount,
          volumeSnapshots: onChainSnapshot.find(
            (row) => row.timestamp === timestamp,
          )?.volumeSnapshots,
        }))
        .filter(
          (snapshot) =>
            snapshot.googleAnalyticsActiveUsers &&
            snapshot.transactionCount &&
            snapshot.walletCount &&
            snapshot.volumeSnapshots,
        )
        .sort((a, b) => b.timestamp - a.timestamp),
    })
  } catch (e: any) {
    res.json({
      status: 'error',
      message: `Internal server error: ${e.message}`,
    })
  }
}
