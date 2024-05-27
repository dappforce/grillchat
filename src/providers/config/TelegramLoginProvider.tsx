import Toast from '@/components/Toast'
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
import { augmentDatahubParams } from '@/services/datahub/utils'
import { useMyAccount, useMyGrillAddress } from '@/stores/my-account'
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
} from 'react'
import toast from 'react-hot-toast'

declare global {
  interface Options {
    bot_id: string
    request_access?: boolean
    lang?: string
  }

  interface Data {
    photo_url?: string
    auth_date: number
    first_name: string
    hash: string
    id: number
    last_name: string
    username: string
  }

  type Callback = (dataOrFalse: Data | false) => void

  interface Window {
    Telegram: {
      Login: {
        auth: (options: Options, callback: Callback) => void
      }
    }
  }
}

type OnSuccess = (linkedIdentity: Identity) => void
type State = {
  loginTelegram: (onSuccessLogin?: OnSuccess) => void
  isLoadingOrSubmitted: boolean
}
const TelegramLoginContext = createContext<State>({
  loginTelegram: () => {
    throw new Error('loginTelegram not implemented')
  },
  isLoadingOrSubmitted: false,
})

export default function TelegramLoginProvider({
  children,
}: {
  children: ReactNode
}) {
  const queryClient = useQueryClient()
  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()
  const userData = useRef<Data | null>(null)

  const myGrillAddress = useMyGrillAddress() ?? ''

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
    const foundMatchingProvider = linkedIdentity?.externalProviders.find(
      (p) => p.provider === IdentityProvider.Telegram
    )
    if (!linkedIdentity || !foundMatchingProvider) return

    function callOnSuccesses() {
      onSuccessCalls.current.forEach((call) => call(linkedIdentity!))
      onSuccessCalls.current = []
    }

    if (isSuccessLinking) {
      getProfileQuery
        .fetchQuery(queryClient, linkedIdentity?.mainAddress ?? '')
        .then((profile) => {
          if (!profile && userData.current) {
            upsertProfile(
              augmentDatahubParams({
                content: {
                  name: `${userData.current.first_name} ${userData.current.last_name}`,
                  image: userData.current.photo_url,
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
    linkedIdentity,
    isSuccessLinking,
    isSuccessAdding,
    resetAdding,
    resetLinking,
    upsertProfile,
    queryClient,
  ])

  const isLoading = isLinking || isAddingProvider || isUpsertingProfile
  const isSuccess =
    isSuccessLinking || isSuccessAdding || isSuccessUpsertingProfile

  const isLoadingRef = useWrapInRef(isLoading)

  const loginTelegram = useCallback(
    (onSuccessLogin?: OnSuccess) => {
      window.Telegram.Login.auth(
        { bot_id: '6342977780', request_access: true },
        async (data) => {
          if (!data) {
            toast.custom((t) => (
              <Toast t={t} title='Login telegram failed, please try again' />
            ))
            return
          }

          useSubscriptionState
            .getState()
            .setSubscriptionState('identity', 'always-sub')
          if (isLoadingRef.current) return

          userData.current = data
          let currentAddress = useMyAccount.getState().address
          if (currentAddress) {
            addExternalProvider({
              externalProvider: {
                provider: SDKIdentityProvider.TELEGRAM,
                id: data.username,
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
                provider: SDKIdentityProvider.TELEGRAM,
                id: data.username,
              },
            })
          }

          if (onSuccessLogin) onSuccessCalls.current.push(onSuccessLogin)
        }
      )
    },
    [addExternalProvider, isLoadingRef, linkIdentity, loginAsTemporaryAccount]
  )

  return (
    <TelegramLoginContext.Provider
      value={{
        loginTelegram,
        isLoadingOrSubmitted: isSuccess || isLoading,
      }}
    >
      <Script async src='https://telegram.org/js/telegram-widget.js?22' />
      {children}
    </TelegramLoginContext.Provider>
  )
}

export function useTelegramLogin() {
  return useContext(TelegramLoginContext)
}
