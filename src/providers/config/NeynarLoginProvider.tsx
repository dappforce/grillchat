import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useWrapInRef from '@/hooks/useWrapInRef'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { Identity } from '@/services/datahub/identity/fetcher'
import {
  useAddExternalProviderToIdentity,
  useLinkIdentity,
} from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import {
  getMyMainAddress,
  useMyAccount,
  useMyGrillAddress,
} from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { IdentityProvider as SDKIdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import Script from 'next/script'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

declare global {
  interface Window {
    onSignInSuccess?: (data: { signer_uuid: string; fid: string }) => void
  }
}

type State = {
  loginNeynar: (onSuccess?: (linkedIdentity: Identity) => void) => void
  isLoadingOrSubmitted: boolean
}
const NeynarLoginContext = createContext<State>({
  loginNeynar: () => {
    throw new Error('loginNeynar not implemented')
  },
  isLoadingOrSubmitted: false,
})

export default function NeynarLoginProvider({
  children,
}: {
  children: ReactNode
}) {
  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()
  const { mutate: setReferrerId } = useSetReferrerId()
  const [refInUrl] = useState(() => getReferralIdInUrl())
  const queryClient = useQueryClient()

  const {
    mutate: addExternalProvider,
    isSuccess: isSuccessAdding,
    isLoading: isAddingProvider,
    reset: resetAdding,
  } = useAddExternalProviderToIdentity()
  const {
    mutate: linkIdentity,
    isSuccess: isSuccessLinking,
    isLoading: isLinking,
    reset: resetLinking,
  } = useLinkIdentity()
  const isLoading = isLinking || isAddingProvider
  const isSuccess = isSuccessLinking || isSuccessAdding

  const isLoadingRef = useWrapInRef(isLoading)

  const onSuccessCalls = useRef<((linkedIdentity: Identity) => void)[]>([])
  const myGrillAddress = useMyGrillAddress() ?? ''
  const { data: linkedIdentity } =
    getLinkedIdentityQuery.useQuery(myGrillAddress)
  useEffect(() => {
    const foundIdentity = linkedIdentity?.externalProviders.find(
      (p) => p.provider === IdentityProvider.Farcaster
    )
    if (linkedIdentity && foundIdentity) {
      resetLinking()
      resetAdding()
      setReferrerId({ refId: refInUrl })
      useMyAccount.getState().finalizeTemporaryAccount()
      onSuccessCalls.current.forEach((call) => call(linkedIdentity))
      onSuccessCalls.current = []

      let retryCount = 5
      const intervalId = setInterval(async () => {
        const myAddress = getMyMainAddress() ?? ''
        if (
          !myAddress ||
          !!getProfileQuery.getQueryData(queryClient, myAddress)
        ) {
          clearInterval(intervalId)
          return
        }
        if (retryCount-- <= 0) {
          clearInterval(intervalId)
          return
        }
        const res = await getProfileQuery.fetchQuery(
          queryClient,
          myAddress,
          true
        )
        if (res) {
          clearInterval(intervalId)
        }
      }, 500)
    }
  }, [
    linkedIdentity,
    resetLinking,
    resetAdding,
    setReferrerId,
    refInUrl,
    queryClient,
  ])

  useEffect(() => {
    window.onSignInSuccess = async (data) => {
      useSubscriptionState
        .getState()
        .setSubscriptionState('identity', 'always-sub')
      if (isLoadingRef.current) return

      let currentAddress = useMyAccount.getState().address
      if (currentAddress) {
        addExternalProvider({
          externalProvider: {
            provider: SDKIdentityProvider.FARCASTER,
            id: data.fid,
            farcasterSignerUuid: data.signer_uuid,
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
            provider: SDKIdentityProvider.FARCASTER,
            id: data.fid,
            farcasterSignerUuid: data.signer_uuid,
          },
        })
      }
    }

    return () => {
      delete window.onSignInSuccess
    }
  }, [loginAsTemporaryAccount, linkIdentity, isLoadingRef, addExternalProvider])

  const loginNeynar = useCallback(
    (onSuccessLogin?: (linkedIdentity: Identity) => void) => {
      const loginBtnContainer = document.getElementById('neynar_signin')
      const loginBtn = loginBtnContainer?.querySelector('button')
      loginBtn?.click()
      if (onSuccessLogin) onSuccessCalls.current.push(onSuccessLogin)
    },
    []
  )

  return (
    <NeynarLoginContext.Provider
      value={{ loginNeynar, isLoadingOrSubmitted: isSuccess || isLoading }}
    >
      <Script src='https://neynarxyz.github.io/siwn/raw/1.2.0/index.js' defer />
      <div
        id='neynar_signin'
        className='neynar_signin pointer-events-none absolute opacity-0 [&>button]:!min-w-[auto]'
        data-client_id={env.NEXT_PUBLIC_NEYNAR_CLIENT_ID}
        data-height='38px'
        data-font_size='14px'
        data-border_radius='50px'
        data-logo_size='24px'
        data-width='190px'
        data-success-callback='onSignInSuccess'
        data-theme='dark'
        data-background_color='#4287f5'
      />
      {children}
    </NeynarLoginContext.Provider>
  )
}

export function useNeynarLogin() {
  return useContext(NeynarLoginContext)
}
