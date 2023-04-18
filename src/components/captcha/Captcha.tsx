import ReCaptchaIcon from '@/assets/logo/recaptcha.svg'
import { cx } from '@/utils/class-names'
import { getCaptchaSiteKey } from '@/utils/env/client'
import { ComponentProps, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { IoCheckmarkOutline } from 'react-icons/io5'
import CaptchaTermsAndService from './CaptchaTermsAndService'

export type CaptchaProps = ComponentProps<'div'> & {
  onVerify: (token: string) => Promise<void> | void
}

const siteKey = getCaptchaSiteKey()

export default function Captcha({
  onVerify: _onVerify,
  ...props
}: CaptchaProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [clickedCaptcha, setClickedCaptcha] = useState(false)
  const captchaRef = useRef<ReCAPTCHA>(null)

  const onExpire = () => {
    setClickedCaptcha(false)
    setToken('')
    setError('Captcha expired, please try again.')
  }

  const onError = () => {
    setClickedCaptcha(false)
    setToken('')
    setError('Captcha error, please try again.')
  }

  const onTriggerCaptcha = () => {
    setClickedCaptcha(true)
    captchaRef.current?.execute()
  }

  const onChange = async (token: string | null) => {
    if (!token) return
    setToken(token)
    setClickedCaptcha(false)
    await _onVerify(token)

    captchaRef.current?.reset()
  }

  return (
    <>
      <div {...props} className={cx('w-full', props.className)}>
        <div className='flex w-full items-center rounded-lg border border-background-lightest bg-background-light py-5 px-4 transition hover:brightness-105'>
          <div
            className={cx(
              'relative mr-3 flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-background-lightest',
              token && 'bg-background-primary text-text-on-primary'
            )}
            onClick={onTriggerCaptcha}
          >
            {clickedCaptcha && !token && (
              <div className='absolute inset-0 h-full w-full animate-pulse bg-background-lightest' />
            )}
            {token && <IoCheckmarkOutline className='text-2xl' />}
          </div>
          <span className=''>I&apos;m human</span>
          <ReCaptchaIcon className='ml-auto h-12 w-12 text-4xl' />
        </div>
        {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
        <CaptchaTermsAndService className='mt-2' />
      </div>
      <ReCAPTCHA
        sitekey={siteKey}
        theme='dark'
        ref={captchaRef}
        size='invisible'
        badge='inline'
        onExpired={onExpire}
        onErrored={onError}
        onChange={onChange}
      />
    </>
  )
}
