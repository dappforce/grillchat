import useToastError from '@/hooks/useToastError'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { UseMutationResult } from '@tanstack/react-query'
import { useState } from 'react'
import useCommonTxSteps from '../hooks'

type Status =
  | 'idle'
  | 'starting'
  | 'sending'
  | 'broadcasting'
  | 'success'
  | 'error'
export function createMutationWrapper<Data, ReturnValue, OtherProps>(
  useMutationHook: (
    config?: SubsocialMutationConfig<Data, any>,
    otherProps?: OtherProps
  ) => UseMutationResult<ReturnValue, Error, Data, unknown>,
  errorMessage: string,
  isUsingConnectedWallet?: boolean
) {
  return function MutationWrapper({
    children,
    config,
    loadingUntilTxSuccess,
    otherProps,
  }: {
    children: (params: {
      mutateAsync: (variables: Data) => Promise<ReturnValue | undefined>
      isLoading: boolean
      status: Status
      loadingText: string | undefined
    }) => JSX.Element
    config?: SubsocialMutationConfig<Data>
    loadingUntilTxSuccess?: boolean
    otherProps?: OtherProps
  }) {
    const [status, setStatus] = useState<Status>('idle')

    const {
      mutation: { mutateAsync, isLoading, error },
    } = useCommonTxSteps(
      useMutationHook,
      {
        ...config,
        txCallbacks: {
          onStart: (...params) => {
            setStatus('starting')
            config?.txCallbacks?.onStart?.(...params)
          },
          onSend: (...params) => {
            setStatus('sending')
            config?.txCallbacks?.onSend?.(...params)
          },
          onBroadcast: (...params) => {
            setStatus('broadcasting')
            config?.txCallbacks?.onBroadcast?.(...params)
          },
          onSuccess: (...params) => {
            setStatus('success')
            config?.txCallbacks?.onSuccess?.(...params)
          },
          onError: (...params) => {
            setStatus('error')
            config?.txCallbacks?.onError?.(...params)
          },
        },
      },
      isUsingConnectedWallet,
      otherProps
    )
    useToastError(error, errorMessage)

    let loadingText: string | undefined = undefined
    switch (status) {
      case 'sending':
        loadingText = 'Sending'
        break
      case 'broadcasting':
        loadingText = 'Broadcasting'
        break
    }

    const loadingStatuses: Status[] = ['starting', 'sending', 'broadcasting']

    return children({
      mutateAsync: async (data) => {
        return mutateAsync(data)
      },
      isLoading: loadingUntilTxSuccess
        ? loadingStatuses.includes(status)
        : isLoading,
      status,
      loadingText,
    })
  }
}
