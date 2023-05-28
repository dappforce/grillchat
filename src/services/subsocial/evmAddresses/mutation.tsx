import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { getLinkedEvmAddressQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { useQueryClient } from '@tanstack/react-query'
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

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<LinkEvmAddressMutationProps, string>(
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
        tx: substrateApi.tx.evmAccounts.unlinkEvmAddress(evmAddress),
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
