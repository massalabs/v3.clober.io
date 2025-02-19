import React from 'react'
import { useRouter } from 'next/router'

import { VaultManagerContainer } from '../../containers/vault/vault-manager-container'
import { useVaultContext } from '../../contexts/vault/vault-context'

export default function PoolManage() {
  const router = useRouter()
  const { vaults } = useVaultContext()

  return router.query.poolKey &&
    vaults.find((vault) => vault.key.toLowerCase() === router.query.poolKey) ? (
    <VaultManagerContainer
      vault={
        vaults.find(
          (vault) => vault.key.toLowerCase() === router.query.poolKey,
        )!
      }
    />
  ) : (
    <></>
  )
}
