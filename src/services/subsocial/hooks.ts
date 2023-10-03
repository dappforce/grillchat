import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import { useRequestToken } from '@/services/api/mutation'
import { useMyAccount } from '@/stores/my-account'
import { SubsocialMutationConfig } from '@/subsocial-query/subsocial/types'
import { useMutation, UseMutationResult } from '@tanstack/react-query'

export function useWalletGetter(isUsingConnectedWallet?: boolean) {
  if (isUsingConnectedWallet) {
    return () => {
      const wallet = useMyAccount.getState().connectedWallet
      return {
        address: wallet?.address ?? '',
        signer: wallet?.signer,
      }
    }
  }
  return () => ({
    address: useMyAccount.getState().address ?? '',
    signer: useMyAccount.getState().signer,
  })
}

export default function useCommonTxSteps<Data, ReturnValue>(
  useMutationHook: (
    config?: SubsocialMutationConfig<Data>
  ) => UseMutationResult<ReturnValue, Error, Data, unknown>,
  config?: SubsocialMutationConfig<Data>
) {
  const address = useMyAccount((state) => state.address)

  const { mutateAsync } = useMutationHook(config)
  const { mutateAsync: requestToken } = useRequestToken()
  const login = useMyAccount((state) => state.login)
  const hasEnoughEnergy = useMyAccount(
    (state) => (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
  )

  const needToRunCaptcha = !address || !hasEnoughEnergy

  const workerFunc = async (params: { captchaToken?: string } & Data) => {
    const { captchaToken } = params
    let usedAddress: string = address ?? ''
    if (!address) {
      const address = await login()
      if (!address) throw new Error('Failed to login')
      usedAddress = address
    }

    if (!hasEnoughEnergy && captchaToken) {
      await requestToken({ address: usedAddress, captchaToken })
    }

    return await mutateAsync(params)
  }

  return {
    mutation: useMutation(workerFunc),
    needToRunCaptcha,
  }
}
