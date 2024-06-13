import Toast from '@/components/Toast'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useToastError from '@/hooks/useToastError'
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
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

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
  const [isClicked, setIsClicked] = useState(false)
  const { mutate: setReferrerId } = useSetReferrerId()
  const [refInUrl] = useState(() => getReferralIdInUrl())

  const myGrillAddress = useMyGrillAddress() ?? ''

  const onSuccess = (action: 'add' | 'link') => {
    const linkedIdentity = getLinkedIdentityQuery.getQueryData(
      queryClient,
      myGrillAddress
    )
    const foundMatchingProvider = linkedIdentity?.externalProviders.find(
      (p) => p.provider === IdentityProvider.Telegram
    )
    if (!linkedIdentity || !foundMatchingProvider) return false

    function onEndProcess() {
      resetUpsertProfile()
      resetAdding()
      resetLinking()
      setReferrerId({ refId: refInUrl })
      useMyAccount.getState().finalizeTemporaryAccount()
      onSuccessCalls.current.forEach((call) => call(linkedIdentity!))
      onSuccessCalls.current = []
    }

    if (action === 'link') {
      getProfileQuery
        .fetchQuery(queryClient, linkedIdentity?.mainAddress ?? '')
        .then(async (profile) => {
          if (!profile && userData.current) {
            let fullName = userData.current.first_name
            if (userData.current.last_name) {
              fullName += ` ${userData.current.last_name}`
            }
            const augmented = await augmentDatahubParams({
              content: {
                name: fullName,
                image: userData.current.photo_url,
              },
            })
            upsertProfile(augmented)?.then(() => onEndProcess())
          } else {
            onEndProcess()
          }
        })
    } else if (action === 'add') {
      onEndProcess()
    }

    return true
  }

  const {
    mutate: addExternalProvider,
    isSuccess: isSuccessAdding,
    isLoading: isAddingProvider,
    reset: resetAdding,
    error: errorAdding,
  } = useAddExternalProviderToIdentity({
    onSuccess: () => {
      const intervalId = setInterval(() => {
        const isDone = onSuccess('add')
        if (isDone) clearInterval(intervalId)
      })
    },
  })
  useToastError(errorAdding, 'Failed to add telegram connection')

  const {
    mutateAsync: upsertProfile,
    isLoading: isUpsertingProfile,
    isSuccess: isSuccessUpsertingProfile,
    reset: resetUpsertProfile,
    error: errorUpserting,
  } = useUpsertProfile()
  useToastError(errorUpserting, 'Failed to create profile')
  const {
    mutate: linkIdentity,
    isSuccess: isSuccessLinking,
    isLoading: isLinking,
    reset: resetLinking,
    error: errorLinking,
  } = useLinkIdentity({
    onSuccess: () => {
      const intervalId = setInterval(() => {
        const isDone = onSuccess('link')
        if (isDone) clearInterval(intervalId)
      })
    },
  })
  useToastError(errorLinking, 'Failed to link telegram account')

  const onSuccessCalls = useRef<OnSuccess[]>([])

  const isLoading =
    isLinking || isAddingProvider || isUpsertingProfile || isClicked
  const isSuccess =
    isSuccessLinking || isSuccessAdding || isSuccessUpsertingProfile

  const loginTelegram = useCallback(
    (onSuccessLogin?: OnSuccess) => {
      if (!env.NEXT_PUBLIC_TELEGRAM_BOT_ID) {
        toast.custom((t) => <Toast t={t} title='Telegram bot id is not set' />)
        return
      }

      window.Telegram.Login.auth(
        { bot_id: env.NEXT_PUBLIC_TELEGRAM_BOT_ID, request_access: true },
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

          userData.current = data
          let currentAddress = useMyAccount.getState().address
          setIsClicked(true)

          if (currentAddress) {
            addExternalProvider({
              externalProvider: {
                username: data.username,
                provider: SDKIdentityProvider.TELEGRAM,
                id: data.id.toString(),
              },
            })
          } else {
            const address = await loginAsTemporaryAccount()
            if (!address) {
              setIsClicked(false)
              return
            }

            linkIdentity({
              externalProvider: {
                username: data.username,
                provider: SDKIdentityProvider.TELEGRAM,
                id: data.id.toString(),
              },
            })
          }
          setIsClicked(false)

          if (onSuccessLogin) onSuccessCalls.current.push(onSuccessLogin)
        }
      )
    },
    [addExternalProvider, linkIdentity, loginAsTemporaryAccount]
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
