import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import useToastError from '@/hooks/useToastError'
import { getSquidUrl } from '@/utils/env/client'
import { UseMutationResult } from '@tanstack/react-query'
import request, { RequestOptions, Variables } from 'graphql-request'
import useCommonTxSteps from './hooks'

export function createSubsocialGraphqlRequest() {
  return <T, V extends Variables = Variables>(config: RequestOptions<V, T>) => {
    return request({ url: getSquidUrl(), ...config })
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

export function createMutationWrapper<Data, ReturnValue>(
  useMutationHook: () => UseMutationResult<ReturnValue, Error, Data, unknown>,
  errorMessage: string
) {
  return function MutationWrapper({
    children,
  }: {
    children: (params: {
      mutateAsync: (variables: Data) => Promise<ReturnValue | undefined>
      isLoading: boolean
    }) => JSX.Element
  }) {
    const {
      mutation: { mutateAsync, isLoading, error },
      needToRunCaptcha,
    } = useCommonTxSteps(useMutationHook)
    useToastError(error, errorMessage)

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
            isLoading,
          })
        }
      </CaptchaInvisible>
    )
  }
}
