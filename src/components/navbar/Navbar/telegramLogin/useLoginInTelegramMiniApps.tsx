import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import useWrapInRef from '@/hooks/useWrapInRef'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { Identity } from '@/services/datahub/identity/fetcher'
import {
  useAddExternalProviderToIdentity,
  useLinkIdentity,
} from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/datahub/profiles/mutation'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { augmentDatahubParams } from '@/services/datahub/utils'
import {
  useMyAccount,
  useMyGrillAddress,
  useMyMainAddress,
} from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { IdentityProvider as SDKIdentityProvider } from '@subsocial/data-hub-sdk'
import { useInitDataRaw } from '@tma.js/sdk-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from 'wagmi'
import useGetPhotoPath from './useGetPhotoPath'

type OnSuccess = (linkedIdentity: Identity) => void

const useLoginInTelegramMiniApps = () => {
  const initData = useInitDataRaw(true)
  const myAddress = useMyMainAddress()
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()

  const data = initData?.result?.user

  const photoPath = useGetPhotoPath(initData?.result?.user?.id.toString())

  const queryClient = useQueryClient()
  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()

  const myGrillAddress = useMyGrillAddress() ?? ''
  const { mutate: setReferrerId } = useSetReferrerId()
  const [refInUrl] = useState(() => getReferralIdInUrl())

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

  const { data: linkedIdentity } =
    getLinkedIdentityQuery.useQuery(myGrillAddress)
  const onSuccessCalls = useRef<OnSuccess[]>([])

  useEffect(() => {
    if (!data) return
    const foundMatchingProvider = linkedIdentity?.externalProviders.find(
      (p) => p.provider === IdentityProvider.Telegram
    )
    if (!linkedIdentity || !foundMatchingProvider) return

    function callOnSuccesses() {
      finalizeTemporaryAccount()
      setReferrerId({ refId: refInUrl })
      onSuccessCalls.current.forEach((call) => call(linkedIdentity!))
      onSuccessCalls.current = []
    }

    if (isSuccessLinking) {
      getProfileQuery
        .fetchQuery(queryClient, linkedIdentity?.mainAddress ?? '')
        .then((profile) => {
          if (!profile) {
            const firstName = data.firstName || ''
            const lastName = data.lastName || ''

            upsertProfile(
              augmentDatahubParams({
                content: {
                  name: `${firstName} ${lastName}`,
                  image: photoPath,
                },
              })
            )?.then(() => callOnSuccesses())
          } else {
            callOnSuccesses()
          }
        })
    } else if (isSuccessAdding) {
      callOnSuccesses()
    }

    resetAdding()
    resetLinking()
  }, [
    finalizeTemporaryAccount,
    linkedIdentity,
    isSuccessLinking,
    isSuccessAdding,
    resetAdding,
    resetLinking,
    upsertProfile,
    queryClient,
    data,
    photoPath,
    refInUrl,
    setReferrerId,
  ])

  const isLoading = isLinking || isAddingProvider || isUpsertingProfile
  const isSuccess =
    isSuccessLinking || isSuccessAdding || isSuccessUpsertingProfile

  const isLoadingRef = useWrapInRef(isLoading)

  const loginTelegram = useCallback(
    async (onSuccessLogin?: OnSuccess) => {
      if (!data) return
      useSubscriptionState
        .getState()
        .setSubscriptionState('identity', 'always-sub')
      if (isLoadingRef.current) return

      let currentAddress = useMyAccount.getState().address
      if (currentAddress) {
        addExternalProvider({
          externalProvider: {
            username: data.username,
            provider: SDKIdentityProvider.TELEGRAM,
            id: data.id?.toString() || '',
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
            username: data.username,
            provider: SDKIdentityProvider.TELEGRAM,
            id: data.id?.toString() || '',
          },
        })
      }

      if (onSuccessLogin) onSuccessCalls.current.push(onSuccessLogin)
    },
    [
      addExternalProvider,
      data,
      isLoadingRef,
      linkIdentity,
      loginAsTemporaryAccount,
    ]
  )

  const isInitializedProxy = useMyAccount.use.isInitializedProxy()
  useEffect(() => {
    if (data && !myAddress && isInitializedProxy) {
      loginTelegram()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, myAddress, isInitializedProxy])

  return { isLoading: isLoading, isSuccess: isSuccess }
}

export default useLoginInTelegramMiniApps
