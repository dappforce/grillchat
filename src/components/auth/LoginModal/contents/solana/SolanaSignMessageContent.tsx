import LinkingDark from '@/assets/graphics/linking-dark.svg'
import LinkingLight from '@/assets/graphics/linking-light.svg'
import useWrapInRef from '@/hooks/useWrapInRef'
import { getSolanaMessage } from '@/services/api/query'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useDatahubIdentitySubscriber } from '@/services/datahub/identity/subscription'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { useWallet } from '@solana/wallet-adapter-react'
import { IdentityProvider as SDKIdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import bs58 from 'bs58'
import { useCallback, useEffect } from 'react'
import { LoginModalContentProps } from '../../LoginModalContent'

const SolanaSignMessageContent = ({
  setCurrentState,
}: LoginModalContentProps) => {
  const { publicKey, signMessage } = useWallet()
  const myGrillAddress = useMyAccount((state) => state.address) ?? ''
  useDatahubIdentitySubscriber()

  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()

  const queryClient = useQueryClient()
  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()

  const { data: linkedIdentity } =
    getLinkedIdentityQuery.useQuery(myGrillAddress)

  const {
    mutate: linkIdentity,
    isSuccess: isSuccessLinking,
    isLoading: isLinking,
  } = useLinkIdentity()

  const isLoading = isLinking
  const isLoadingRef = useWrapInRef(isLoading)

  useEffect(() => {
    if (!publicKey?.toString() && isSuccessLinking) return
    const foundMatchingProvider = linkedIdentity?.externalProviders.find(
      (p) => p.provider === IdentityProvider.Solana && p.enabled
    )

    if (!linkedIdentity || !foundMatchingProvider) return

    if (isSuccessLinking) {
      finalizeTemporaryAccount()
      useLoginModal.getState().openNextStepModal({
        step: 'save-grill-key',
        provider: 'solana',
        onFinish: () => {
          useLoginModal.getState().openNextStepModal({
            step: 'create-profile',
          })
        },
      })
    }
  }, [
    finalizeTemporaryAccount,
    linkedIdentity,
    isSuccessLinking,
    queryClient,
    publicKey,
  ])

  const loginSolana = useCallback(async () => {
    if (!publicKey?.toString() || isLoadingRef.current) return

    try {
      const message = await getSolanaMessage(publicKey.toString())
      const signature = await signMessage?.(new TextEncoder().encode(message))

      const decodedSignature = bs58.encode(signature || [])

      const address = await loginAsTemporaryAccount()

      if (!address) {
        console.error('Failed to login account')
        return
      }

      if (message && decodedSignature) {
        linkIdentity({
          externalProvider: {
            id: publicKey.toString(),
            provider: SDKIdentityProvider.SOLANA,
            solProofMsg: message,
            solProofMsgSig: decodedSignature,
          },
        })
      } else {
        // setCurrentState('evm-linking-error')
      }
    } catch (error) {
      console.error('Failed to sign message', error)
      // setCurrentState('evm-linking-error')
    }
  }, [
    isLoadingRef,
    linkIdentity,
    loginAsTemporaryAccount,
    publicKey,
    setCurrentState,
    signMessage,
  ])

  const isInitializedProxy = useMyAccount.use.isInitializedProxy()

  useEffect(() => {
    loginSolana()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey?.toString(), parentProxyAddress, isInitializedProxy])

  return (
    <div className='flex flex-col'>
      <div className='mb-2 w-full'>
        <LinkingLight className='block w-full dark:hidden' />
        <LinkingDark className='hidden w-full dark:block' />
      </div>
    </div>
  )
}

export default SolanaSignMessageContent
