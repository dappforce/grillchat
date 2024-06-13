import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import { sendEventWithRef } from '@/components/referral/analytics'
import useToastError from '@/hooks/useToastError'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/datahub/profiles/mutation'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { useSubscribeViaLoginGoogle } from '@/services/subsocial-offchain/mutation'
import { useSendEvent } from '@/stores/analytics'
import {
  useMyAccount,
  useMyGrillAddress,
  useMyMainAddress,
} from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { useTransactions } from '@/stores/transactions'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { estimatedWaitTime } from '@/utils/network'
import { replaceUrl } from '@/utils/window'
import {
  LinkedIdentityExternalProviderDetails,
  IdentityProvider as SDKIdentityProvider,
} from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import Modal from '../modals/Modal'
import { getReferralIdInUrl } from '../referral/ReferralUrlChanger'

const providerMapper: Record<
  Session['provider'],
  { name: string; providerId: SDKIdentityProvider }
> = {
  google: { name: 'Google', providerId: SDKIdentityProvider.GOOGLE },
  twitter: { name: 'X', providerId: SDKIdentityProvider.TWITTER },
}
export default function OauthLoadingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const provider = session?.provider
  const myAddress = useMyMainAddress()
  const router = useRouter()

  useEffect(() => {
    const isAfterOauthLogin = getUrlQuery('login')
    if (
      (isAfterOauthLogin === 'x' || isAfterOauthLogin === 'google') &&
      session &&
      !myAddress
    ) {
      setIsOpen(true)
    } else if (myAddress && isAfterOauthLogin) {
      router.replace(getCurrentUrlWithoutQuery('login'), undefined, {
        shallow: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, myAddress])

  return (
    <Modal
      title={`🕔 Connecting to ${providerMapper[provider ?? 'google'].name}`}
      description={`We are connecting your ${
        providerMapper[provider ?? 'google'].name
      } account to Epic. Please wait for a few seconds.`}
      isOpen={isOpen}
      closeModal={() => undefined}
    >
      {isOpen && <DoOauthLogin onSuccess={() => setIsOpen(false)} />}
      <div className='flex flex-col items-center gap-4'>
        <DynamicLoadedHamsterLoading />
        <span className='text-sm text-text-muted'>
          It may take up to {estimatedWaitTime} seconds
        </span>
      </div>
    </Modal>
  )
}

function DoOauthLogin({ onSuccess }: { onSuccess: () => void }) {
  useOauthLogin({ onSuccess })
  return null
}

export function getExternalProviderPayload(
  session: Session
): LinkedIdentityExternalProviderDetails | null {
  if (session.provider === 'google') {
    return {
      id: session.user.email ?? session.user.id,
      provider: SDKIdentityProvider.GOOGLE,
    }
  } else if (session.provider === 'twitter') {
    return {
      id: session.user?.id,
      provider: SDKIdentityProvider.TWITTER,
      username: session.user?.name ?? undefined,
    }
  }
  return null
}

function useOauthLogin({ onSuccess }: { onSuccess: () => void }) {
  const sendEvent = useSendEvent()
  const { mutate: subscribeViaLoginGoogle } = useSubscribeViaLoginGoogle()

  const { data: session, status } = useSession()
  const provider = session?.provider ?? ''
  const { providerId: identity, name } =
    (provider && providerMapper[provider]) || {}

  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()
  const router = useRouter()

  const grillAddress = useMyGrillAddress()
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const { mutate: linkIdentity, error: errorLinking } = useLinkIdentity()
  useToastError(
    errorLinking,
    `Failed to link ${name} profile`,
    () => 'Please refresh the page to relink your account'
  )

  const { mutate: setReferrerId } = useSetReferrerId()
  const [refInUrl] = useState(() => getReferralIdInUrl())

  const client = useQueryClient()
  const onFinishFlow = () => {
    router.replace(getCurrentUrlWithoutQuery('login'), undefined, {
      shallow: true,
    })
    sendEvent('login_oauth_successful', { provider })
    finalizeTemporaryAccount()
    setReferrerId({ refId: refInUrl })
    onSuccess()
    signOut({ redirect: false })

    // if (
    //   linkedIdentity &&
    //   !linkedIdentity.externalProviders.find(
    //     (p) => p.provider === IdentityProvider.Evm
    //   )
    // ) {
    //   useLoginModal.getState().openNextStepModal({ step: 'connect-evm' })
    // }
  }
  const { mutate: upsertProfile, error: errorUpsert } = useUpsertProfile({
    onSuccess: () => {
      replaceUrl(getCurrentUrlWithoutQuery('login'))
      sendEvent('login_oauth_successful', { provider })
      finalizeTemporaryAccount()
      onSuccess()
      signOut({ redirect: false })
    },
  })
  useToastError(
    errorUpsert,
    'Failed to create profile',
    () => 'Please refresh the page to relink your account'
  )

  useEffect(() => {
    if (errorLinking || errorUpsert) {
      sendEvent('login_oauth_error', {
        value: errorLinking || errorUpsert,
        provider,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorLinking, errorUpsert])

  const setBlockchainSubscriptionState = useTransactions(
    (state) => state.setSubscriptionState
  )
  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )
  useEffect(() => {
    setBlockchainSubscriptionState('always-sub')
    setSubscriptionState('identity', 'always-sub')
    return () => {
      setBlockchainSubscriptionState('dynamic')
      setSubscriptionState('identity', 'dynamic')
    }
  }, [setSubscriptionState, setBlockchainSubscriptionState])

  const upsertedProfile = useRef(false)
  useEffect(() => {
    const foundIdentity = linkedIdentity && session

    if (foundIdentity && !upsertedProfile.current) {
      sendEvent(
        'oauth_login_creating_profile',
        { provider },
        {
          twitterLinked: true,
        }
      )
      upsertedProfile.current = true
      getProfileQuery
        .fetchQuery(client, linkedIdentity.mainAddress)
        .then(async (profile) => {
          if (!profile) {
            const augmented = await augmentDatahubParams({
              content: {
                image: session?.user?.image ?? '',
                name: session?.user.name ?? '',
              },
            })
            upsertProfile(augmented)
          } else onFinishFlow()
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedIdentity, sendEvent, session, upsertProfile])

  const isAlreadyCalled = useRef(false)
  useEffect(() => {
    // if unauthenticated (not using oauth), do nothing
    if (status === 'unauthenticated') {
      return
    }
    if (isAlreadyCalled.current || !session) return

    isAlreadyCalled.current = true
    sendEvent('oauth_login_linking', { provider })
    ;(async () => {
      const address = await loginAsTemporaryAccount()
      if (!address || !identity) return

      const payload = getExternalProviderPayload(session)
      if (!payload) {
        toast.error('Provider not supported')
        return
      }
      linkIdentity({ externalProvider: payload })

      sendEventWithRef(address, async (refId) => {
        sendEvent('account_created', { loginBy: provider }, { ref: refId })
      })

      if (provider === 'google' && session.user?.email) {
        subscribeViaLoginGoogle({
          address,
          email: session.user.email,
        })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])
}
