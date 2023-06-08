import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { AccountData } from '@/pages/api/accounts-data'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { useDisconnect } from 'wagmi'

type LinkEvmAddressMutationProps = {
  evmAddress: string
  evmSignature: string
}

type LinkEvmAddressProps = {
  setModalStep?: () => void
  config?: MutationConfig<LinkEvmAddressMutationProps>
  onError?: () => void
  linkedEvmAddress?: string
}

export function useLinkEvmAddress({
  setModalStep,
  config,
  onError,
  linkedEvmAddress,
}: LinkEvmAddressProps) {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)
  const client = useQueryClient()
  const [onCallbackLoading, setOnCallbackLoading] = useState(false)

  const waitHasBalance = useWaitHasEnergy()

  const mutation = useSubsocialMutation<LinkEvmAddressMutationProps, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()

      const { evmAddress, evmSignature } = params

      const linkEvmAddressTx = substrateApi.tx.evmAccounts.linkEvmAddress(
        evmAddress,
        evmSignature
      )

      const tx = linkedEvmAddress
        ? substrateApi.tx.utility.batch([
            substrateApi.tx.evmAccounts.unlinkEvmAddress(linkedEvmAddress),
            linkEvmAddressTx,
          ])
        : linkEvmAddressTx

      return {
        tx,
        summary: 'Linking evm address',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: () => '',
        onStart: () => setOnCallbackLoading(true),
        onSuccess: async ({ address }) => {
          await mutateAccountsDataCache(address)
          await getAccountDataQuery.fetchQuery(client, address)

          setOnCallbackLoading(false)
          setModalStep?.()
        },
        onError: () => {
          setOnCallbackLoading(false)
          onError?.()
        },
      },
    }
  )

  return {
    ...mutation,
    onCallbackLoading,
  }
}

type UnlinkEvmAddress = {
  evmAddress: string
}

export function useUnlinkEvmAddress(
  setModalStep?: () => void,
  config?: MutationConfig<UnlinkEvmAddress>,
  onError?: () => void
) {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)
  const client = useQueryClient()
  const { disconnect } = useDisconnect()
  const [onCallbackLoading, setOnCallbackLoading] = useState(false)

  const waitHasBalance = useWaitHasEnergy()

  const mutation = useSubsocialMutation<UnlinkEvmAddress, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()

      const { evmAddress } = params

      return {
        tx: substrateApi.tx.evmAccounts.unlinkEvmAddress(evmAddress),
        summary: 'Unlinking evm address',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: () => '',
        onStart: () => setOnCallbackLoading(true),
        onSuccess: async ({ address }) => {
          await mutateAccountsDataCache(address)
          await getAccountDataQuery.fetchQuery(client, address)

          setOnCallbackLoading(false)
          disconnect()
          setModalStep?.()
        },
        onError: () => {
          setOnCallbackLoading(false)
          onError?.()
        },
      },
    }
  )

  return {
    ...mutation,
    onCallbackLoading,
  }
}

async function mutateAccountsDataCache(address: string) {
  const res = await axios.post('/api/accounts-data?' + `addresses=${address}`)

  return res.data.data as AccountData[]
}
