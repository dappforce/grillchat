import HCaptchaIcon from '@/assets/logo/hcaptcha.svg'
import { cx } from '@/utils/className'
import { getCaptchaSiteKey } from '@/utils/env/client'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { IoCheckmarkOutline } from 'react-icons/io5'

export type CaptchaProps = ComponentProps<'div'> & {
  token: string
  setToken: (token: string) => void
}

const siteKey = getCaptchaSiteKey()

export default function Captcha({ token, setToken, ...props }: CaptchaProps) {
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const captchaRef = useRef<HCaptcha>(null)

  useEffect(() => {
    if (!token) captchaRef.current?.resetCaptcha()
  }, [token])

  const onLoad = () => {
    setLoaded(true)
  }

  const onExpire = () => {
    setToken('')
    setError('Captcha expired, please try again.')
  }

  const onError = () => {
    setToken('')
    setError('Captcha error, please try again.')
  }

  const onTriggerCaptcha = () => {
    if (loaded) captchaRef.current?.execute()
  }

  return (
    <>
      <div {...props} className={cx('w-full', props.className)}>
        <div className='flex w-full items-center rounded-lg border border-background-lighter bg-background-light py-5 px-4 transition hover:brightness-105'>
          <div
            className={cx(
              'mr-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-background-lighter',
              token && 'bg-background-primary'
            )}
            onClick={onTriggerCaptcha}
          >
            {token && <IoCheckmarkOutline className='text-2xl' />}
          </div>
          <span className=''>I&apos;m human</span>
          <HCaptchaIcon className='ml-auto text-4xl' />
        </div>
        {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
      </div>
      <HCaptcha
        size='invisible'
        onLoad={onLoad}
        theme='dark'
        onVerify={setToken}
        onExpire={onExpire}
        sitekey={siteKey}
        onError={onError}
        ref={captchaRef}
      />
    </>
  )
}
