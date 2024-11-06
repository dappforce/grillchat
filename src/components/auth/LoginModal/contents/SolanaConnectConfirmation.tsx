import useWrapInRef from '@/hooks/useWrapInRef'
import { getSolanaMessage } from '@/services/api/query'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { Identity } from '@/services/datahub/identity/fetcher'
import {
  useAddExternalProviderToIdentity,
  useLinkIdentity,
} from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/datahub/profiles/mutation'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { useMyAccount } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { useWallet } from '@solana/wallet-adapter-react'
import { IdentityProvider as SDKIdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import bs58 from 'bs58'
import { useCallback, useEffect, useRef } from 'react'
import { LoginModalContentProps } from '../LoginModalContent'

type OnSuccess = (linkedIdentity: Identity) => void

const SolanaConnectConfirmation = ({
  setCurrentState,
}: LoginModalContentProps) => {
  const { publicKey, signMessage } = useWallet()
  const myGrillAddress = useMyAccount((state) => state.address) ?? ''

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
    reset: resetAdding,
  } = useAddExternalProviderToIdentity()

  const {
    mutateAsync: upsertProfile,
    isLoading: isUpsertingProfile,
    isSuccess: isSuccessUpsertingProfile,
  } = useUpsertProfile()
  const {
    mutate: linkIdentity,
    isSuccess: isSuccessLinking,
    isLoading: isLinking,
    reset: resetLinking,
  } = useLinkIdentity()

  const isLoading = isLinking || isAddingProvider || isUpsertingProfile
  const isSuccess =
    isSuccessLinking || isSuccessAdding || isSuccessUpsertingProfile

  const isLoadingRef = useWrapInRef(isLoading)

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

    if (isSuccessLinking) {
      getProfileQuery
        .fetchQuery(queryClient, linkedIdentity?.mainAddress ?? '')
        .then(async (profile) => {
          if (!profile) {
            const augmented = await augmentDatahubParams({
              content: {
                name: `some name`,
              },
            })
            upsertProfile(augmented)?.then(() => callOnSuccesses())
          } else {
            callOnSuccesses()
          }
        })
      resetAdding()
      resetLinking()
    } else if (isSuccessAdding) {
      callOnSuccesses()
      resetAdding()
      resetLinking()
    }
  }, [
    finalizeTemporaryAccount,
    linkedIdentity,
    isSuccessLinking,
    isSuccessAdding,
    resetAdding,
    resetLinking,
    upsertProfile,
    queryClient,
    publicKey?.toString(),
  ])

  const loginSolana = useCallback(
    async (onSuccessLogin?: OnSuccess) => {
      if (!publicKey?.toString()) return
      useSubscriptionState
        .getState()
        .setSubscriptionState('identity', 'always-sub')
      if (isLoadingRef.current) return

      let currentAddress = useMyAccount.getState().address

      const message = await getSolanaMessage(publicKey.toString())

      const signature = await signMessage?.(new TextEncoder().encode(message))

      const decodedSignature = bs58.encode(signature || [])

      if (currentAddress) {
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

      if (onSuccessLogin) onSuccessCalls.current.push(onSuccessLogin)
    },
    [
      addExternalProvider,
      publicKey?.toString(),
      isLoadingRef,
      linkIdentity,
      loginAsTemporaryAccount,
    ]
  )

  const isInitializedProxy = useMyAccount.use.isInitializedProxy()

  useEffect(() => {
    const login = async () => {
      if (publicKey?.toString() && !parentProxyAddress && isInitializedProxy) {
        await loginSolana()
      } else if (
        publicKey?.toString() &&
        isInitializedProxy &&
        parentProxyAddress
      ) {
        // check if the user has profile, because if in any case that the chain of login operations fail, making user doesn't have profile,
        // the call will never get called again without this
        getProfileQuery
          .fetchQuery(queryClient, parentProxyAddress)
          .then(async (profile) => {
            if (!profile) {
              // const firstName = data.firstName || ''
              // const lastName = data.lastName || ''
              const augmented = await augmentDatahubParams({
                content: {
                  name: `some name`,
                },
              })
              upsertProfile(augmented)
            }
          })
      }
    }

    login()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey?.toString(), parentProxyAddress, isInitializedProxy])

  return (
    <div className='flex flex-col'>
      {!isSuccess && isLoading ? <>Loading...</> : <>Successfully linked</>}
    </div>
  )
}

export default SolanaConnectConfirmation
