import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { sendEventWithRef } from '@/components/referral/analytics'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useToastError from '@/hooks/useToastError'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useSetReferrerId } from '@/services/datahub/referral/mutation'
import { useUpsertProfile } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { useTransactions } from '@/stores/transactions'
import { getCurrentUrlWithoutQuery } from '@/utils/links'
import { encodeProfileSource } from '@/utils/profile'
import { replaceUrl } from '@/utils/window'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { useQueryClient } from '@tanstack/react-query'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

const providerMapper: Record<
  Session['provider'],
  { name: string; providerId: IdentityProvider }
> = {
  google: { name: 'Google', providerId: IdentityProvider.GOOGLE },
  twitter: { name: 'X', providerId: IdentityProvider.TWITTER },
}

export default function useOauthLogin({
  onSuccess,
}: {
  onSuccess: () => void
}) {
  const sendEvent = useSendEvent()

  const { data: session, status } = useSession()
  const provider = session?.provider ?? ''
  const { providerId: identity, name } =
    (provider && providerMapper[provider]) || {}

  const { mutateAsync: loginAsTemporaryAccount } = useLoginAndRequestToken({
    asTemporaryAccount: true,
  })

  const queryClient = useQueryClient()
  const myAddress = useMyMainAddress()
  const finalizeTemporaryAccount = useMyAccount.use.finalizeTemporaryAccount()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    myAddress ?? ''
  )
  const { mutate: linkIdentity, error: errorLinking } = useLinkIdentity()
  useToastError(
    errorLinking,
    `Failed to link ${name} profile`,
    () => 'Please refresh the page to relink your account'
  )

  const { mutate: setReferrerId } = useSetReferrerId()

  const { mutate: upsertProfile, error: errorUpsert } = useUpsertProfile({
    txCallbacks: {
      onSuccess: () => {
        replaceUrl(getCurrentUrlWithoutQuery('login'))
        sendEvent('login_oauth_successful', { provider })
        finalizeTemporaryAccount()
        onSuccess()
      },
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
    const foundIdentity =
      linkedIdentity &&
      session &&
      linkedIdentity?.externalId === session?.user?.id

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
          profileSource: encodeProfileSource({
            source: 'subsocial-profile',
          }),
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
      const address = await loginAsTemporaryAccount(null)
      if (!address || !identity) return
      setReferrerId({ refId: getReferralIdInUrl() })
      linkIdentity({
        id: session.user?.id,
        provider: identity,
      })

      sendEventWithRef(address, async (refId) => {
        sendEvent('account_created', { loginBy: provider }, { ref: refId })
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])
}
