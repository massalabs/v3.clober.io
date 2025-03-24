import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { VaultManagerContainer } from '../../../containers/vault/vault-manager-container'
import { useVaultContext } from '../../../contexts/vault/vault-context'
import { VAULT_KEY_INFOS } from '../../../constants/vault'
import { useChainContext } from '../../../contexts/chain-context'

export default function PoolManage() {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  const { vaults } = useVaultContext()

  useEffect(() => {
    if (
      !VAULT_KEY_INFOS[selectedChain.id].find(
        (v) => v.key.toLowerCase() === router.query.poolKey,
      )
    ) {
      router.push(`/earn?chainId=${selectedChain.id}`)
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
