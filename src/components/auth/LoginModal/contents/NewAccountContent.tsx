import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery } from '@/utils/links'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { IoLogoGoogle } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import urlJoin from 'url-join'
import { LoginModalContentProps } from '../LoginModalContent'
import { getRedirectCallback } from '../utils'

export default function NewAccountContent({
  setCurrentState,
}: LoginModalContentProps) {
  const sendEvent = useSendEvent()
  return (
    <div className='flex flex-col gap-4'>
      <GoogleButton />
      <XLoginButton />
      <span className='text-center text-sm text-text-muted'>
        By creating an account, you agree to the{' '}
        <LinkText
          href='https://grillapp.net/legal/content-policy'
          variant='primary'
        >
          Content Policy
        </LinkText>
        .
      </span>
      <div className='relative flex items-center justify-center text-center text-text-muted'>
        <div className='absolute top-1/2 h-px w-full bg-background-lightest dark:bg-background-lightest/50' />
        <span className='relative inline-block bg-background-light px-4 text-xs'>
          OR
        </span>
      </div>
      <Button
        size='lg'
        variant='primaryOutline'
        onClick={() => {
          setCurrentState('login')
          sendEvent('login_already_have_clicked')
        }}
      >
        <div className='flex flex-col items-center justify-center'>
          <span>I already have an account</span>
        </div>
      </Button>
    </div>
  )
}

function getOauthCallbackUrl(oauthProvider: string) {
  const fromQuery = encodeURIComponent(getRedirectCallback())
  const refQuery = encodeURIComponent(getReferralIdInUrl())
  return urlJoin(
    getCurrentUrlWithoutQuery(),
    `?login=${oauthProvider}`,
    fromQuery ? `&from=${fromQuery}` : '',
    refQuery ? `&ref=${refQuery}` : ''
  )
}
function GoogleButton() {
  const [loading, setLoading] = useState(false)
  const sendEvent = useSendEvent()
  return (
    <Button
      size='lg'
      isLoading={loading}
      onClick={() => {
        setLoading(true)
        sendEvent('login_google_clicked')
        signIn('google', {
          callbackUrl: getOauthCallbackUrl('google'),
        })
      }}
    >
      <div className='flex items-center justify-center gap-2'>
        <IoLogoGoogle
          className={cx('text-[20px] text-text-muted-on-primary')}
        />
        Connect with Google
      </div>
    </Button>
  )
}

function XLoginButton() {
  const [loading, setLoading] = useState(false)
  const sendEvent = useSendEvent()
  return (
    <Button
      size='lg'
      variant='primaryOutline'
      isLoading={loading}
      onClick={() => {
        setLoading(true)
        sendEvent('login_twitter_clicked')
        signIn('twitter', {
          callbackUrl: getOauthCallbackUrl('x'),
        })
      }}
    >
      <div className='flex items-center justify-center gap-2'>
        <RiTwitterXLine className={cx('text-[20px] text-text-muted')} />
        Connect with X
      </div>
    </Button>
  )
}
