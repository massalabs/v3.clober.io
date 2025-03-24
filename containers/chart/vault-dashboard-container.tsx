import React, { useMemo } from 'react'

import { currentTimestampInSeconds } from '../../utils/date'
import { Vault } from '../../model/vault'

export const VaultDashboardContainer = ({ vault }: { vault: Vault }) => {
  const [now, hourAgo, sixHourAgo] = useMemo(() => {
    const now = currentTimestampInSeconds() * 1000
    return [now, now - 60 * 60 * 1000, now - 6 * 60 * 60 * 1000]
  }, [])

  return vault.key.toLowerCase() ===
    '0xc8cbe608c82ee9c4c30f01d7c0eefd977538ac396ed34430aa3993bfe0d363ae' ? (
    <div className="flex flex-col gap-2 w-full">
      <iframe
        src={`https://mm.clober.io/d-solo/dduzjbo4k05j4b/clober-market-making?orgId=1&panelId=3&from=${hourAgo}&to=${now}&theme=dark`}
        width="1115"
        height="400"
        frameBorder="0"
      />

      <div className="flex flex-row gap-2 w-[1200px]">
        <div className="flex flex-col gap-2">
          <iframe
            src={`https://mm.clober.io/d-solo/decq277ym7apse/8459b0b4-5466-5cf1-bb28-2568c6603344?orgId=1&panelId=10&from=${sixHourAgo}&to=${now}&theme=dark`}
            frameBorder="0"
            width="500"
            height="250"
          />
          <iframe
            src={`https://mm.clober.io/d-solo/decq277ym7apse/8459b0b4-5466-5cf1-bb28-2568c6603344?orgId=1&panelId=12&from=${sixHourAgo}&to=${now}&theme=dark`}
            width="500"
            height="400"
            frameBorder="0"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 flex-1">
            <iframe
              src={`https://mm.clober.io/d-solo/decq277ym7apse/8459b0b4-5466-5cf1-bb28-2568c6603344?orgId=1&panelId=14&from=${sixHourAgo}&to=${now}&theme=dark`}
              frameBorder="0"
              width="300"
              height="320"
            />
            <iframe
              src={`https://mm.clober.io/d-solo/decq277ym7apse/8459b0b4-5466-5cf1-bb28-2568c6603344?orgId=1&panelId=15&from=${sixHourAgo}&to=${now}&theme=dark`}
              frameBorder="0"
              width="300"
              height="320"
            />
          </div>

          <div className="flex flex-row gap-2 flex-1">
            <iframe
              src={`https://mm.clober.io/d-solo/decq277ym7apse/8459b0b4-5466-5cf1-bb28-2568c6603344?orgId=1&panelId=2&from=${sixHourAgo}&to=${now}&theme=dark`}
              frameBorder="0"
              width="300"
              height="320"
            />
            <iframe
              src={`https://mm.clober.io/d-solo/decq277ym7apse/8459b0b4-5466-5cf1-bb28-2568c6603344?orgId=1&panelId=3&from=${sixHourAgo}&to=${now}&theme=dark`}
              frameBorder="0"
              width="300"
              height="320"
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
