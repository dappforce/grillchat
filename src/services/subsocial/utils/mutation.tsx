import useToastError from '@/hooks/useToastError'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { UseMutationResult } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import useCommonTxSteps from '../hooks'

const CaptchaInvisible = dynamic(
  () => import('@/components/captcha/CaptchaInvisible'),
  {
    ssr: false,
  }
)

type Status =
  | 'idle'
  | 'starting'
  | 'sending'
  | 'broadcasting'
  | 'success'
  | 'error'
export function createMutationWrapper<Data, ReturnValue>(
  useMutationHook: () => UseMutationResult<ReturnValue, Error, Data, unknown>,
  errorMessage: string,
  isUsingConnectedWallet?: boolean
) {
  return function MutationWrapper({
    children,
    config,
    loadingUntilTxSuccess,
  }: {
    children: (params: {
      mutateAsync: (variables: Data) => Promise<ReturnValue | undefined>
      isLoading: boolean
      status: Status
      loadingText: string | undefined
    }) => JSX.Element
    config?: SubsocialMutationConfig<Data>
    loadingUntilTxSuccess?: boolean
  }) {
    const [status, setStatus] = useState<Status>('idle')

    const {
      mutation: { mutateAsync, isLoading, error },
      needToRunCaptcha,
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
      isUsingConnectedWallet
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

    return (
      <CaptchaInvisible>
        {(runCaptcha) =>
          children({
            mutateAsync: async (data) => {
              let captchaToken
              if (needToRunCaptcha) {
                captchaToken = await runCaptcha()
                if (!captchaToken) return
              }
              return mutateAsync({ captchaToken, ...data })
            },
            isLoading: loadingUntilTxSuccess
              ? loadingStatuses.includes(status)
              : isLoading,
            status,
            loadingText,
          })
        }
      </CaptchaInvisible>
    )
  }
}
