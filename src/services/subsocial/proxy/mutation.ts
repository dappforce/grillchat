import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { useMyAccount } from '@/stores/my-account'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../hooks'
import { createMutationWrapper } from '../utils'
import { getProxiesQuery } from './query'

export function useAddProxy(config?: SubsocialMutationConfig<null>) {
  const client = useQueryClient()
  const waitHasEnergy = useWaitHasEnergy(true)

  return useSubsocialMutation(
    {
      getWallet: () => getCurrentWallet('injected'),
      generateContext: undefined,
      transactionGenerator: async ({ apis: { substrateApi } }) => {
        console.log('waiting energy...')
        await waitHasEnergy()
        const currentGrillAddress = useMyAccount.getState().address
        if (!currentGrillAddress)
          throw new Error('No address connected to use proxy')

        const addProxyTx = substrateApi.tx.freeProxy.addFreeProxy(
          currentGrillAddress,
          'SocialActions',
          0
        )

        const currentConnectedAddress =
          useMyAccount.getState().connectedWallet?.address
        if (!currentConnectedAddress)
          throw new Error('No address connected as the parent proxy')

        let userProxies = []
        try {
          userProxies = await getProxiesQuery.fetchQuery(client, {
            address: currentConnectedAddress,
          })
        } catch (e) {
          // if error getting proxy, assume that it has the current address as proxy so it will batch remove it first
          userProxies = [currentGrillAddress]
        }

        if (userProxies.length > 0) {
          return {
            tx: substrateApi.tx.utility.batchAll([
              substrateApi.tx.proxy.removeProxies(),
              addProxyTx,
            ]),
            summary: 'Removing all proxies and adding proxy',
          }
        }

        return {
          tx: addProxyTx,
          summary: 'Adding proxy',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: () => {
          getProxiesQuery.invalidate(client)
        },
      },
    }
  )
}
export const AddProxyWrapper = createMutationWrapper(
  useAddProxy,
  'Failed to add proxy',
  true
)

export function useRemoveProxy(config?: SubsocialMutationConfig<null>) {
  const client = useQueryClient()
  const waitHasEnergy = useWaitHasEnergy()

  return useSubsocialMutation(
    {
      getWallet: getCurrentWallet,
      generateContext: undefined,
      transactionGenerator: async ({ apis: { substrateApi } }) => {
        console.log('waiting energy...')
        await waitHasEnergy()
        const removeProxyTx = substrateApi.tx.proxy.removeProxies()

        return {
          tx: removeProxyTx,
          summary: 'Remove all proxy',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onSuccess: () => {
          getProxiesQuery.invalidate(client)
        },
      },
    }
  )
}
export const RemoveProxyWrapper = createMutationWrapper(
  useRemoveProxy,
  'Failed to remove proxy'
)
