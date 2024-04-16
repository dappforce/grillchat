import useLoginOption from '@/hooks/useLoginOption'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
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
  isUsingConnectedWallet?: boolean,
  otherProps?: OtherProps
) {
  const connectedWallet = useMyAccount((state) => state.connectedWallet)
  const myAddress = useMyMainAddress()
  const address = isUsingConnectedWallet ? connectedWallet?.address : myAddress

  const { mutateAsync } = useMutationHook(config, otherProps)

  const { promptUserForLogin } = useLoginOption()

  const workerFunc = async (params: Data) => {
    let usedAddress: string = address ?? ''
    if (!address) {
      const address = await promptUserForLogin()
      if (!address) return
      usedAddress = address
    }

    return await mutateAsync(params)
  }

  return {
    mutation: useMutation(workerFunc),
  }
}
