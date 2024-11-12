import LinkingDark from '@/assets/graphics/linking-dark.svg'
import LinkingLight from '@/assets/graphics/linking-light.svg'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getSolanaMessage } from '@/services/api/query'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { Identity } from '@/services/datahub/identity/fetcher'
import {
  useAddExternalProviderToIdentity,
  useLinkIdentity,
} from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { useWallet } from '@solana/wallet-adapter-react'
import { IdentityProvider as SDKIdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import bs58 from 'bs58'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LoginModalContentProps } from '../LoginModalContent'

type OnSuccess = (linkedIdentity: Identity) => void

const SolanaConnectConfirmation = ({
  setCurrentState,
}: LoginModalContentProps) => {
  const { publicKey, signMessage } = useWallet()
  const myGrillAddress = useMyAccount((state) => state.address) ?? ''
  const [decodedSignature, setDecodedSignature] = useState<string | null>(null)

  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()

  const queryClient = useQueryClient()
  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()

  const { data: linkedIdentity } =
    getLinkedIdentityQuery.useQuery(myGrillAddress)
  const onSuccessCalls = useRef<OnSuccess[]>([])

  const {
    mutate: addExternalProvider,
    isSuccess: isSuccessAdding,
    isLoading: isAddingProvider,
  } = useAddExternalProviderToIdentity()

  const {
    mutate: linkIdentity,
    isSuccess: isSuccessLinking,
    isError: isErrorLinking,
    error: errorLinking,
    isLoading: isLinking,
  } = useLinkIdentity()

  const isLoading = isLinking || isAddingProvider
  const isLoadingRef = useWrapInRef(isLoading)

  console.log(isErrorLinking, errorLinking)

  useEffect(() => {
    if (!publicKey?.toString()) return
    const foundMatchingProvider = linkedIdentity?.externalProviders.find(
      (p) => p.provider === IdentityProvider.Solana && p.enabled
    )
    if (!linkedIdentity || !foundMatchingProvider) return

    function callOnSuccesses() {
      finalizeTemporaryAccount()
      onSuccessCalls.current.forEach((call) => call(linkedIdentity!))
      onSuccessCalls.current = []
    }

    console.log(isSuccessLinking, isSuccessAdding)

    if (isSuccessLinking) {
      useLoginModal
        .getState()
        .openNextStepModal({ step: 'save-grill-key', provider: 'solana' })
    } else if (isSuccessAdding) {
      callOnSuccesses()
      useLoginModal.getState().openNextStepModal({ step: 'create-profile' })
    }
  }, [
    finalizeTemporaryAccount,
    linkedIdentity,
    isSuccessLinking,
    isSuccessAdding,
    queryClient,
    publicKey,
  ])

  const loginSolana = useCallback(
    async (onSuccessLogin?: OnSuccess) => {
      if (!publicKey?.toString()) return
      useSubscriptionState
        .getState()
        .setSubscriptionState('identity', 'always-sub')
      if (isLoadingRef.current) return
      const message = await getSolanaMessage(publicKey.toString())
      let currentAddress = useMyAccount.getState().address

      console.log(message)

      console.log('Decoded signature', decodedSignature)

      console.log(currentAddress)

      if (!decodedSignature) {
        const signature = await signMessage?.(new TextEncoder().encode(message))

        const decodedSignature = bs58.encode(signature || [])

        setDecodedSignature(decodedSignature)
      } else {
        if (currentAddress) {
          console.log('Adding external provider')
          addExternalProvider({
            externalProvider: {
              provider: SDKIdentityProvider.SOLANA,
              id: publicKey.toString(),
              solProofMsg: message,
              solProofMsgSig: decodedSignature,
            },
          })
        } else {
          const address = await loginAsTemporaryAccount()
          console.log('Linking identity', address)
          if (!address) {
            console.error('Failed to login account')
            return
          }

          linkIdentity({
            externalProvider: {
              id: publicKey.toString(),
              provider: SDKIdentityProvider.SOLANA,
              solProofMsg: message,
              solProofMsgSig: decodedSignature,
            },
          })
        }
      }
      if (onSuccessLogin) onSuccessCalls.current.push(onSuccessLogin)
    },
    [
      addExternalProvider,
      decodedSignature,
      isLoadingRef,
      linkIdentity,
      loginAsTemporaryAccount,
      publicKey,
      signMessage,
    ]
  )

  const isInitializedProxy = useMyAccount.use.isInitializedProxy()

  useEffect(() => {
    loginSolana()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    publicKey?.toString(),
    parentProxyAddress,
    isSuccessLinking,
    isInitializedProxy,
    decodedSignature,
  ])

  return (
    <div className='flex flex-col'>
      <div className='mb-2 w-full'>
        <LinkingLight className='block w-full dark:hidden' />
        <LinkingDark className='hidden w-full dark:block' />
      </div>
    </div>
  )
}

export default SolanaConnectConfirmation
