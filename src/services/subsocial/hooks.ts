import useLoginOption from '@/hooks/useLoginOption'
import { useRequestToken } from '@/services/api/mutation'
import {
  getHasEnoughEnergy,
  useMyAccount,
  useMyMainAddress,
} from '@/stores/my-account'
import {
  SubsocialMutationConfig,
  WalletAccount,
} from '@/subsocial-query/subsocial/types'
import { UseMutationResult, useMutation } from '@tanstack/react-query'

export function getCurrentWallet(
  walletType: 'injected' | 'grill' = 'grill'
): WalletAccount {
  if (walletType === 'injected') {
    const wallet = useMyAccount.getState().connectedWallet

    return {
      address: wallet?.address ?? '',
      signer: wallet?.signer ?? null,
    }
  }
  return {
    address: useMyAccount.getState().address ?? '',
    signer: useMyAccount.getState().signer,
    proxyToAddress: useMyAccount.getState().parentProxyAddress,
  }
}

export default function useCommonTxSteps<Data, ReturnValue, OtherProps>(
  useMutationHook: (
    config?: SubsocialMutationConfig<Data>,
    otherProps?: OtherProps
  ) => UseMutationResult<ReturnValue, Error, Data, unknown>,
  config?: SubsocialMutationConfig<Data>,
  otherProps?: OtherProps
) {
  const myAddress = useMyMainAddress()

  const hasEnoughEnergy = useMyAccount((state) =>
    getHasEnoughEnergy(state.energy)
  )

  const { mutateAsync } = useMutationHook(config, otherProps)
  const { mutateAsync: requestToken } = useRequestToken()

  const { promptUserForLogin } = useLoginOption()

  const workerFunc = async (params: Data) => {
    let usedAddress: string = myAddress ?? ''
    if (!usedAddress) {
      const address = await promptUserForLogin()
      if (!address) return
      usedAddress = address
    }

    if (!hasEnoughEnergy) {
      const [_, res] = await Promise.all([
        requestToken({ address: usedAddress }),
        mutateAsync(params),
      ])
      return res
    }

    return await mutateAsync(params)
  }

  return {
    mutation: useMutation(workerFunc),
  }
}
