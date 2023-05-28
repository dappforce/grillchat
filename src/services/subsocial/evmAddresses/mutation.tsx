import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { getLinkedEvmAddressQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { useQueryClient } from '@tanstack/react-query'
import { useDisconnect } from 'wagmi'

type LinkEvmAccountProps = {
  evmAddress: string
  evmSignature: string
}

export function useLinkEvmAddress(
  setModalStep?: () => void,
  config?: MutationConfig<LinkEvmAccountProps>,
  onError?: () => void
) {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)
  const client = useQueryClient()

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<LinkEvmAccountProps, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()

      const { evmAddress, evmSignature } = params

      return {
        tx: substrateApi.tx.evmAccounts.linkEvmAddress(
          evmAddress,
          evmSignature
        ),
        summary: 'Linking evm address',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: () => '',
        onSuccess: ({ address }) => {
          getLinkedEvmAddressQuery.invalidate(client, address)
          setModalStep?.()
        },
        onError: () => {
          onError?.()
        },
      },
    }
  )
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

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<UnlinkEvmAddress, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()

      const { evmAddress } = params

      return {
        tx: substrateApi.tx.evmAccounts.unlinkEvmAddress(
          evmAddress,
        ),
        summary: 'Unlinking evm address',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: () => '',
        onSuccess: ({ address }) => {
          getLinkedEvmAddressQuery.invalidate(client, address)
          disconnect()
          setModalStep?.()
        },
        onError: () => {
          onError?.()
        },
      },
    }
  )
}
