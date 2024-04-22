import useLoginOption from '@/hooks/useLoginOption'
import useToastError from '@/hooks/useToastError'
import { getMyMainAddress } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { UseMutationResult } from '@tanstack/react-query'
import { useMemo } from 'react'

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

    const mutate = useMemo(() => {
      return mutationWrapper(
        mutation.mutate,
        getMyMainAddress(),
        promptUserForLogin
      )
    }, [mutation.mutate, promptUserForLogin])
    const mutateAsync = useMemo(() => {
      return mutationWrapper(
        mutation.mutateAsync,
        getMyMainAddress(),
        promptUserForLogin
      )
    }, [mutation.mutateAsync, promptUserForLogin])

    return {
      ...mutation,
      mutate,
      mutateAsync,
    }
  }
}
