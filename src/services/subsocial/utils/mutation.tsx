import useLoginOption from '@/hooks/useLoginOption'
import useToastError from '@/hooks/useToastError'
import { getMyMainAddress } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { UseMutationResult } from '@tanstack/react-query'
import { useCallback } from 'react'

export type Status =
  | 'idle'
  | 'starting'
  | 'sending'
  | 'broadcasting'
  | 'success'
  | 'error'

function mutationWrapper<Args extends unknown[], Return>(
  mutation: (...args: Args) => Return,
  myAddress: string | null,
  promptForLogin: () => void
): (...params: Args) => Return | undefined {
  return (...params: Args) => {
    if (!myAddress) {
      promptForLogin()
      return
    }
    return mutation(...params)
  }
}
export function createMutationWrapper<Data, ReturnValue, OtherProps>(
  useMutationHook: (
    config?: MutationConfig<Data, any>,
    otherProps?: OtherProps
  ) => UseMutationResult<ReturnValue, Error, Data, unknown>,
  errorMessage: string
) {
  return function useWrappedMutation(
    config?: MutationConfig<Data, ReturnValue>,
    otherProps?: OtherProps
  ) {
    const { promptUserForLogin } = useLoginOption()
    const mutation = useMutationHook(config, otherProps)
    useToastError(mutation.error, errorMessage)

    const { mutate: rawMutate, mutateAsync: rawMutateAsync } = mutation
    const mutate = useCallback(
      (...args: Parameters<typeof rawMutate>) => {
        return mutationWrapper(
          rawMutate,
          getMyMainAddress(),
          promptUserForLogin
        )(...args)
      },
      [rawMutate, promptUserForLogin]
    )
    const mutateAsync = useCallback(
      (...args: Parameters<typeof rawMutateAsync>) => {
        return mutationWrapper(
          rawMutateAsync,
          getMyMainAddress(),
          promptUserForLogin
        )(...args)
      },
      [rawMutateAsync, promptUserForLogin]
    )

    return {
      ...mutation,
      mutate,
      mutateAsync,
    }
  }
}
