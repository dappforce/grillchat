import LoadingAnimation from '@/assets/animations/loading.json'
import useLoginAndRequestToken from '@/hooks/useLoginAndRequestToken'
import { useLinkIdentity } from '@/services/datahub/identity/mutation'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useUpsertProfile } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { getCurrentUrlWithoutQuery } from '@/utils/links'
import { encodeProfileSource } from '@/utils/profile'
import { replaceUrl } from '@/utils/window'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'
import Lottie, { LottieProps } from 'react-lottie'
import { LoginModalContentProps } from '../LoginModalContent'

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
  const { mutate: linkIdentity } = useLinkIdentity()
  const { mutate: upsertProfile } = useUpsertProfile({
    onSuccess: () => {
      replaceUrl(getCurrentUrlWithoutQuery('login'))
      setCurrentState('account-created')
      sendEvent('x_login_done')
    },
  })

  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )
  useEffect(() => {
    setSubscriptionState('identity', 'always-sub')
    return () => {
      setSubscriptionState('identity', 'dynamic')
    }
  }, [setSubscriptionState])

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

  const defaultOptions: LottieProps = {
    options: {
      loop: true,
      autoplay: true,
      animationData: LoadingAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    },
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <Lottie {...defaultOptions} height={250} width={250} />
      <span className='text-sm text-text-muted'>
        It may take up to 15 seconds
      </span>
    </div>
  )
}
