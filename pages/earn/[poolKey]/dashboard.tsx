import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { VaultManagerContainer } from '../../../containers/vault/vault-manager-container'
import { useVaultContext } from '../../../contexts/vault/vault-context'
import { WHITELISTED_VAULTS } from '../../../constants/vault'
import { useChainContext } from '../../../contexts/chain-context'

export default function PoolManage() {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const { vaults } = useVaultContext()

  useEffect(() => {
    if (
      !WHITELISTED_VAULTS[selectedChain.id].find(
        (v) => v.key.toLowerCase() === router.query.poolKey,
      )
    ) {
      router.push('/earn')
    }
  }, [router, selectedChain.id])

  return router.query.poolKey &&
    vaults.find((vault) => vault.key.toLowerCase() === router.query.poolKey) ? (
    <VaultManagerContainer
      vault={
        vaults.find(
          (vault) => vault.key.toLowerCase() === router.query.poolKey,
        )!
      }
      showDashboard={true}
    />
  ) : (
    <></>
  )
}
