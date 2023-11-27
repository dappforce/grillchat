import useWithoutAnonLoginOptions from '@/hooks/useWithoutAnonLoginOptions'
import { useRequestToken } from '@/services/api/mutation'
import { getHasEnoughEnergy, useMyAccount } from '@/stores/my-account'
import {
  SubsocialMutationConfig,
  WalletAccount,
} from '@/subsocial-query/subsocial/types'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export function useWalletGetter(
  isUsingConnectedWallet?: boolean
): () => WalletAccount {
  if (isUsingConnectedWallet) {
    return () => {
      const wallet = useMyAccount.getState().connectedWallet
      return {
        address: wallet?.address ?? '',
        signer: wallet?.signer ?? null,
      }
    }
  }
  return () => ({
    address: useMyAccount.getState().address ?? '',
    signer: useMyAccount.getState().signer,
    proxyToAddress: useMyAccount.getState().parentProxyAddress,
  })
}

export default function useCommonTxSteps<Data, ReturnValue>(
  useMutationHook: (
    config?: SubsocialMutationConfig<Data>
  ) => UseMutationResult<ReturnValue, Error, Data, unknown>,
  config?: SubsocialMutationConfig<Data>,
  isUsingConnectedWallet?: boolean
) {
  const connectedWallet = useMyAccount((state) => state.connectedWallet)
  const grillAddress = useMyAccount((state) => state.address)
  const address = isUsingConnectedWallet
    ? connectedWallet?.address
    : grillAddress

  const hasEnoughEnergyGrillAddress = useMyAccount((state) =>
    getHasEnoughEnergy(state.energy)
  )
  const hasEnoughEnergy = isUsingConnectedWallet
    ? getHasEnoughEnergy(connectedWallet?.energy)
    : hasEnoughEnergyGrillAddress

  const { mutateAsync } = useMutationHook(config)
  const { mutateAsync: requestToken } = useRequestToken()
  const login = useMyAccount((state) => state.login)

  const { withoutAnonLoginOptions, promptUserForLogin } =
    useWithoutAnonLoginOptions()
  const needToRunCaptcha = !address || !hasEnoughEnergy

  const workerFunc = async (params: { captchaToken?: string } & Data) => {
    const { captchaToken } = params
    let usedAddress: string = address ?? ''
    if (!address) {
      if (withoutAnonLoginOptions) {
        const address = await promptUserForLogin()
        if (!address) return
        usedAddress = address
      } else {
        const address = await login()
        if (!address) throw new Error('Failed to login')
        usedAddress = address
      }
    }

    if (!hasEnoughEnergy && captchaToken) {
      const [_, res] = await Promise.all([
        requestToken({ address: usedAddress, captchaToken }),
        mutateAsync(params),
      ])
      return res
    }

    return await mutateAsync(params)
  }

  return {
    mutation: useMutation(workerFunc),
    needToRunCaptcha,
  }
}
