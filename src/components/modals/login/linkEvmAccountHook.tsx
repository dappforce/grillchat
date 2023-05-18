import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { getLinkedEvmAddressQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { useQueryClient } from '@tanstack/react-query'

type LinkEvmAccountProps = {
  evmAccount: string
  evmSignature: string
}

export function useLinkEvmAccount(
  config?: MutationConfig<LinkEvmAccountProps>
) {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)
  const client = useQueryClient()

  const waitHasBalance = useWaitHasEnergy()

  return useSubsocialMutation<LinkEvmAccountProps, string>(
    async () => ({ address, signer }),
    async (params, { substrateApi }) => {
      await waitHasBalance()

      const { evmAccount, evmSignature } = params

      return {
        tx: substrateApi.tx.evmAccounts.linkEthAddress(
          evmAccount,
          evmSignature
        ),
        summary: 'Linking evm address',
      }
    },
    config,
    {
      txCallbacks: {
        getContext: (_params) => { 
          return ''
         },
        onSuccess: ({ address }) => {
          getLinkedEvmAddressQuery.invalidate(client, address)
        },
      },
    }
  )
}
