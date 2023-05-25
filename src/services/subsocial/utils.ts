import useToastError from '@/hooks/useToastError'
import { UseMutationResult } from '@tanstack/react-query'

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
  return function ({
    children,
  }: {
    children: (params: {
      mutate: (variables: Data) => void
      isLoading: boolean
    }) => JSX.Element
  }) {
    const { mutate, isLoading, error } = useMutationHook()
    useToastError(error, errorMessage)

    return children({ mutate, isLoading })
  }
}
