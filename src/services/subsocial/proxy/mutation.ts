import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useMyAccount } from '@/stores/my-account'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useWalletGetter } from '../hooks'
import { createMutationWrapper } from '../utils'

export function useAddProxy(config?: SubsocialMutationConfig<null>) {
  const getWallet = useWalletGetter(true)
  const waitHasEnergy = useWaitHasEnergy(true)

  return useSubsocialMutation(
    getWallet,
    async (_, { substrateApi }) => {
      console.log('waiting energy...')
      await waitHasEnergy()
      const currentGrillAddress = useMyAccount.getState().address
      if (!currentGrillAddress)
        throw new Error('No address connected to use proxy')

      return {
        tx: substrateApi.tx.freeProxy.addFreeProxy(
          currentGrillAddress,
          'SocialActions',
          0
        ),
        summary: 'Adding Proxy',
      }
    },
    config
  )
}
export const AddProxyWrapper = createMutationWrapper(
  useAddProxy,
  'Failed to add proxy',
  true
)
