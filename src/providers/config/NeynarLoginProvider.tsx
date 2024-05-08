import { env } from '@/env.mjs'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useLoginModal } from '@/stores/login-modal'
import {
  useMyAccount,
  useMyGrillAddress,
  useMyMainAddress,
} from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import Script from 'next/script'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react'

declare global {
  interface Window {
    onSignInSuccess?: (data: { signer_uuid: string; fid: string }) => void
  }
}

type State = {
  loginNeynar: () => void
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
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()
  const grillAddress = useMyGrillAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const client = useQueryClient()

  useEffect(() => {
    if (linkedIdentity) {
      getProfileQuery
        .fetchQuery(client, linkedIdentity?.mainAddress)
        .then((profile) => {
          if (!profile) {
            useLoginModal
              .getState()
              .openNextStepModal({ step: 'create-profile' })
          }
        })

      useSubscriptionState
        .getState()
        .setSubscriptionState('identity', 'dynamic')
    }
  }, [linkedIdentity, client])

  const { mutate, isSuccess, isLoading, reset } = useLinkIdentity({
    onSuccess: () => {
      finalizeTemporaryAccount()
    },
  })
  const isLoadingRef = useWrapInRef(isLoading)

  const mainAddress = useMyMainAddress()
  useEffect(() => {
    if (!mainAddress) reset()
  }, [mainAddress, reset])

  useEffect(() => {
    window.onSignInSuccess = async (data) => {
      const address = await loginAsTemporaryAccount()
      if (!address) {
        console.error('Failed to login account')
        return
      }

      useSubscriptionState
        .getState()
        .setSubscriptionState('identity', 'always-sub')
      if (!isLoadingRef.current) {
        mutate({
          externalProvider: {
            provider: IdentityProvider.FARCASTER,
            id: data.fid,
            farcasterSignerUuid: data.signer_uuid,
          },
        })
      }
    }

    return () => {
      delete window.onSignInSuccess
    }
  }, [loginAsTemporaryAccount, mutate, isLoadingRef])

  const loginNeynar = useCallback(() => {
    const loginBtnContainer = document.getElementById('neynar_signin')
    const loginBtn = loginBtnContainer?.querySelector('button')
    loginBtn?.click()
  }, [])

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
