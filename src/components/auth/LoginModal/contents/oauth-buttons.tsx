import Button from '@/components/Button'
import { getReferralIdInUrl } from '@/components/referral/ReferralUrlChanger'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getCurrentUrlWithoutQuery } from '@/utils/links'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { IoLogoGoogle } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import urlJoin from 'url-join'
import { getRedirectCallback } from '../utils'

function getOauthCallbackUrl(oauthProvider: string) {
  const fromQuery = encodeURIComponent(getRedirectCallback())
  const refQuery = encodeURIComponent(getReferralIdInUrl())
  return urlJoin(
    getCurrentUrlWithoutQuery().replace(/\/$/, ''),
    `?login=${oauthProvider}`,
    fromQuery ? `&from=${fromQuery}` : '',
    refQuery ? `&ref=${refQuery}` : ''
  )
}
export function GoogleButton() {
  const [loading, setLoading] = useState(false)
  const sendEvent = useSendEvent()
  return (
    <Button
      size='lg'
      variant='primaryOutline'
      isLoading={loading}
      onClick={() => {
        setLoading(true)
        sendEvent('login_google_clicked')
        signIn('google', {
          callbackUrl: getOauthCallbackUrl('google'),
        })
      }}
    >
      <div className='flex items-center justify-center gap-2 text-text'>
        <IoLogoGoogle className={cx('text-xl text-text-muted')} />
        Connect with Google
      </div>
    </Button>
  )
}

export function XLoginButton() {
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
      <div className='flex items-center justify-center gap-2 text-text'>
        <RiTwitterXLine className={cx('text-xl text-text-muted')} />
        Connect with X
      </div>
    </Button>
  )
}
