import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useMyAccount } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'

type LinkEvmAccountProps = {
  evmAccount: string
  evmSignature: string
}

export function useLinkEvmAccount(
  config?: MutationConfig<LinkEvmAccountProps>
) {
  const address = useMyAccount((state) => state.address ?? '')
  const signer = useMyAccount((state) => state.signer)

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
    config
  )
}
