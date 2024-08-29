import useWaitHasEnergy from '@/hooks/useWaitHasEnergy'
import { AccountData } from '@/pages/api/accounts-data'
import { apiInstance } from '@/services/api/utils'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { MutationConfig } from '@/subsocial-query'
import { useSubsocialMutation } from '@/subsocial-query/subsocial/mutation'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useDisconnect } from 'wagmi'
import { createMutationWrapper } from '../utils/mutation'
import { getEvmPalletName } from './utils'

type LinkEvmAddressMutationProps = {
  evmAddress: string
  evmSignature: string
}

type LinkEvmAddressProps = {
  onSuccess?: () => void
  config?: MutationConfig<LinkEvmAddressMutationProps>
  onError?: () => void
  linkedEvmAddress?: string | null
}

export function useLinkEvmAddress({
  onSuccess,
  config,
  onError,
  linkedEvmAddress,
}: LinkEvmAddressProps) {
  const sendEvent = useSendEvent()
  const client = useQueryClient()
  const [onCallbackLoading, setOnCallbackLoading] = useState(false)

  const waitHasBalance = useWaitHasEnergy()

  const mutation = useSubsocialMutation<LinkEvmAddressMutationProps>(
    {
      walletType: 'dynamic',
      generateContext: undefined,
      transactionGenerator: async ({
        data: params,
        apis: { substrateApi },
      }) => {
        await waitHasBalance()

        const { evmAddress, evmSignature } = params

        const linkEvmAddressTx = substrateApi.tx[
          getEvmPalletName()
        ].linkEvmAddress(evmAddress, evmSignature)

        const tx = linkedEvmAddress
          ? substrateApi.tx.utility.batch([
              substrateApi.tx[getEvmPalletName()].unlinkEvmAddress(
                linkedEvmAddress
              ),
              linkEvmAddressTx,
            ])
          : linkEvmAddressTx

        return {
          tx,
          summary: 'Linking evm address',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onStart: ({ address }) => {
          setOnCallbackLoading(true)
          mutateAccountsDataCache(address)
        },
        onSuccess: async ({ address }) => {
          getAccountDataQuery.invalidate(client, address)

          setOnCallbackLoading(false)
          sendEvent('evm-address-linked', undefined, { evmLinked: true })
          onSuccess?.()
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

export function useUnlinkEvmAddress(config?: MutationConfig<UnlinkEvmAddress>) {
  const client = useQueryClient()
  const { disconnect } = useDisconnect()
  const [onCallbackLoading, setOnCallbackLoading] = useState(false)

  const waitHasBalance = useWaitHasEnergy()

  const mutation = useSubsocialMutation<UnlinkEvmAddress>(
    {
      walletType: 'dynamic',
      generateContext: undefined,
      transactionGenerator: async ({
        data: params,
        apis: { substrateApi },
      }) => {
        await waitHasBalance()

        const { evmAddress } = params

        return {
          tx: substrateApi.tx[getEvmPalletName()].unlinkEvmAddress(evmAddress),
          summary: 'Unlinking evm address',
        }
      },
    },
    config,
    {
      txCallbacks: {
        onStart: () => setOnCallbackLoading(true),
        onSend: ({ address }) => {
          getAccountDataQuery.setQueryData(client, address, (data) => {
            if (!data) return data
            return {
              ...data,
              evmAddress: null,
              ensNames: null,
            }
          })
        },
        onSuccess: async ({ address }) => {
          await mutateAccountsDataCache(address)

          getAccountDataQuery.invalidate(client, address)

          setOnCallbackLoading(false)
          disconnect()
        },
        onError: () => {
          setOnCallbackLoading(false)
        },
      },
    }
  )

  return {
    ...mutation,
    onCallbackLoading,
  }
}
export const UnlinkEvmAddressWrapper = createMutationWrapper(
  useUnlinkEvmAddress,
  'unlink-evm-address'
)

async function mutateAccountsDataCache(address: string) {
  const res = await apiInstance.post(
    '/api/accounts-data?' + `addresses=${address}`
  )

  return res.data.data as AccountData[]
}
