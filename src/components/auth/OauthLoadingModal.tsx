import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { sendEventWithRef } from '@/components/referral/analytics'
import useToastError from '@/hooks/useToastError'
import useWrapInRef from '@/hooks/useWrapInRef'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/datahub/profiles/mutation'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { useSubscribeViaLoginGoogle } from '@/services/subsocial-offchain/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyGrillAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { useTransactions } from '@/stores/transactions'
import { getCurrentUrlWithoutQuery, getUrlQuery } from '@/utils/links'
import { estimatedWaitTime } from '@/utils/network'
import { replaceUrl } from '@/utils/window'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../modals/Modal'

const providerMapper: Record<
  Session['provider'],
  { name: string; providerId: IdentityProvider }
> = {
  google: { name: 'Google', providerId: IdentityProvider.GOOGLE },
  twitter: { name: 'X', providerId: IdentityProvider.TWITTER },
}
export default function OauthLoadingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const provider = session?.provider

  useEffect(() => {
    const isAfterOauthLogin = getUrlQuery('login')
    if (isAfterOauthLogin === 'x' || isAfterOauthLogin === 'google') {
      setIsOpen(true)
    }
  }, [])

  return (
    <Modal
      title={`🕔 Connecting to ${providerMapper[provider ?? 'google'].name}`}
      description={`We are connecting your ${
        providerMapper[provider ?? 'google'].name
      } account to Grill. Please wait for a few seconds.`}
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

function useOauthLogin({ onSuccess }: { onSuccess: () => void }) {
  const sendEvent = useSendEvent()
  const { mutate: subscribeViaLoginGoogle } = useSubscribeViaLoginGoogle()

  const { data: session, status } = useSession()
  const provider = session?.provider ?? ''
  const { providerId: identity, name } =
    (provider && providerMapper[provider]) || {}

  const loginAsTemporaryAccount = useMyAccount.use.loginAsTemporaryAccount()

  const grillAddress = useMyGrillAddress()
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()
  const { data: linkedIdentity, refetch } = getLinkedIdentityQuery.useQuery(
    grillAddress ?? ''
  )
  const linkedIdentityRef = useWrapInRef(linkedIdentity)
  const { mutate: linkIdentity, error: errorLinking } = useLinkIdentity({
    onSuccess: () => {
      const intervalId = setInterval(async () => {
        if (linkedIdentityRef.current) {
          clearInterval(intervalId)
          return
        }

        const res = await refetch()
        if (res.data) {
          clearInterval(intervalId)
        }
      }, 2_000)
    },
  })
  useToastError(
    errorLinking,
    `Failed to link ${name} profile`,
    () => 'Please refresh the page to relink your account'
  )

  const { mutate: setReferrerId } = useSetReferrerId()

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
      upsertProfile({
        content: {
          image: session?.user?.image ?? '',
          name: session?.user.name ?? '',
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedIdentity, sendEvent, session, upsertProfile, setReferrerId])

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
      setReferrerId({ refId: getReferralIdInUrl() })

      if (provider === 'google') {
        linkIdentity({
          externalProvider: {
            id: session.user.email ?? session.user.id,
            provider: identity,
          },
        })
      } else if (provider === 'twitter') {
        linkIdentity({
          externalProvider: {
            id: session.user?.id,
            provider: identity,
            username: session.user?.name ?? undefined,
          },
        })
      } else {
        toast.error('Provider not supported')
        return
      }

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
