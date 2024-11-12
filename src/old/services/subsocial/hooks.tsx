import Toast from '@/components/Toast'
import useLoginOption from '@/hooks/useLoginOption'
import {
  SubsocialMutationConfig,
  WalletAccount,
} from '@/old/subsocial-query/subsocial/types'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function getCurrentWallet(
  walletType: 'injected' | 'grill' = 'grill'
): WalletAccount {
  if (walletType === 'injected') {
    return {
      address: useMyAccount.getState()?.address ?? '',
      signer: useMyAccount.getState()?.signer ?? null,
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
  const { address: connectedAddress } = useMyAccount()
  const myAddress = useMyMainAddress()
  const address = isUsingConnectedWallet ? connectedAddress : myAddress

  const { mutateAsync } = useMutationHook(config, otherProps)

  const { promptUserForLogin } = useLoginOption()

  const workerFunc = async (params: Data) => {
    let usedAddress: string = address ?? ''
    if (!usedAddress) {
      if (isUsingConnectedWallet) {
        toast.custom((t) => (
          <Toast
            t={t}
            title='Please connect to your polkadot wallet to perform this action'
          />
        ))
        return
      } else {
        const address = await promptUserForLogin()
        if (!address) return
        usedAddress = address
      }
    }

    return await mutateAsync(params)
  }

  return {
    mutation: useMutation(workerFunc),
  }
}
