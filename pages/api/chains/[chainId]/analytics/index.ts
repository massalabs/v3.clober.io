import { NextApiRequest, NextApiResponse } from 'next'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { CHAIN_IDS, getSubgraphEndpoint } from '@clober/v2-sdk'

import { Subgraph } from '../../../../../constants/subgraph'

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

const getOnChainSnapshot = async (): Promise<
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
      }[]
    }
  }>(
    endpoint,
    'getOnChainSnapshot',
    'query getOnChainSnapshot { snapshots { id transactionCount walletCount } }',
    {},
  )
  return snapshots.map((snapshot) => ({
    timestamp: Number(snapshot.id),
    transactionCount: Number(snapshot.transactionCount),
    walletCount: Number(snapshot.walletCount),
    // TODO: filter whitelist currencies
    volumeSnapshots: [
      {
        symbol: 'MON',
        amount: 12351234.323,
      },
      {
        symbol: 'USDC',
        amount: 1345.6765,
      },
    ],
  }))
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    const [googleAnalyticsActiveUsersSnapshot, onChainSnapshot] =
      await Promise.all([
        getGoogleAnalyticsActiveUsersSnapshot(),
        getOnChainSnapshot(),
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
