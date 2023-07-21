import useToastError from '@/hooks/useToastError'
import { createQuery } from '@/subsocial-query'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { getSquidUrl } from '@/utils/env/client'
import { UseMutationResult } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import useCommonTxSteps from './hooks'

const CaptchaInvisible = dynamic(
  () => import('@/components/captcha/CaptchaInvisible'),
  {
    ssr: false,
  }
)

type DynamicSubsocialQueryFetcher<Data, ReturnValue> = {
  blockchain: (data: SubsocialQueryData<Data>) => Promise<ReturnValue>
  squid: (data: Data) => Promise<ReturnValue>
}
export function createDynamicSubsocialQuery<Data, ReturnValue>(
  key: string,
  fetcher: DynamicSubsocialQueryFetcher<Data, ReturnValue>
) {
  const isExistSquidUrl = !!getSquidUrl()

  if (isExistSquidUrl) {
    return createQuery({
      key,
      fetcher: fetcher.squid,
    })
  }

  return createSubsocialQuery({
    key,
    fetcher: fetcher.blockchain,
  })
}

type DataSource = 'blockchain' | 'squid'
export function standaloneDynamicFetcherWrapper<Data, ReturnValue>(
  fetcher: DynamicSubsocialQueryFetcher<Data, ReturnValue>
) {
  return async (data: Data, dataSource: DataSource = 'squid') => {
    const isExistSquidUrl = !!getSquidUrl()

    if (isExistSquidUrl && dataSource === 'squid') {
      return fetcher.squid(data)
    }

    const api = await getSubsocialApi()
    return fetcher.blockchain({ data, api })
  }
}

const OPTIMISTIC_ID_PREFIX = 'optimistic-'
const ID_DATA_SEPARATOR = '|||'
export function generateOptimisticId<Data = any>(data?: Data) {
  return `${OPTIMISTIC_ID_PREFIX}${Date.now()}${ID_DATA_SEPARATOR}${JSON.stringify(
    data
  )}`
}

export function isOptimisticId(id: string) {
  return id.startsWith(OPTIMISTIC_ID_PREFIX)
}

export function extractOptimisticIdData<Data>(id: string) {
  if (!isOptimisticId(id)) return undefined
  const [, param] = id.split(ID_DATA_SEPARATOR)
  return JSON.parse(param) as Data
}

type Status =
  | 'idle'
  | 'starting'
  | 'sending'
  | 'broadcasting'
  | 'success'
  | 'error'
export function createMutationWrapper<Data, ReturnValue>(
  useMutationHook: () => UseMutationResult<ReturnValue, Error, Data, unknown>,
  errorMessage: string
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
    } = useCommonTxSteps(useMutationHook, {
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
    })
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
