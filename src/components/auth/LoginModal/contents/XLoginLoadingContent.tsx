import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import useToastError from '@/hooks/useToastError'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { useTransactions } from '@/stores/transactions'
import { getCurrentUrlWithoutQuery } from '@/utils/links'
import { encodeProfileSource } from '@/utils/profile'
import { replaceUrl } from '@/utils/window'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { LoginModalContentProps } from '../LoginModalContent'

const HamsterLoading = dynamic

export default function XLoginLoading({
  closeModal,
  setCurrentState,
}: LoginModalContentProps) {
  const sendEvent = useSendEvent()

  const { data: session, status } = useSession()
  const { mutateAsync: loginAsTemporaryAccount } = useLoginAndRequestToken({
    asTemporaryAccount: true,
  })

  const myAddress = useMyMainAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    myAddress ?? ''
  )
  const { mutate: linkIdentity, error: errorLinking } = useLinkIdentity()
  useToastError(
    errorLinking,
    'Failed to link X profile',
    () => 'Please refresh the page to relink your account'
  )
  const { mutate: upsertProfile, error: errorUpsert } = useUpsertProfile({
    onSuccess: () => {
      replaceUrl(getCurrentUrlWithoutQuery('login'))
      setCurrentState('account-created')
      sendEvent('x_login_done')
    },
  })
  useToastError(
    errorUpsert,
    'Failed to create profile',
    () => 'Please refresh the page to relink your account'
  )

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
      sendEvent('x_login_creating_profile', undefined, { twitterLinked: true })
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
  }, [linkedIdentity, sendEvent, session, setCurrentState, upsertProfile])

  const isAlreadyCalled = useRef(false)
  useEffect(() => {
    if (status === 'unauthenticated') {
      closeModal()
      return
    }
    if (isAlreadyCalled.current || !session) return

    isAlreadyCalled.current = true
    sendEvent('x_login_linking')
    ;(async () => {
      const address = await loginAsTemporaryAccount(null)
      if (!address) return
      linkIdentity({
        id: session.user?.id,
        provider: IdentityProvider.TWITTER,
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  return (
    <div className='flex flex-col items-center gap-4'>
      <DynamicLoadedHamsterLoading />
      <span className='text-sm text-text-muted'>
        It may take up to 15 seconds
      </span>
    </div>
  )
}
