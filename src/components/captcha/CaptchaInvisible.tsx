import { getCaptchaSiteKey } from '@/utils/env/client'
import React, { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'react-hot-toast'
import Toast from '../Toast'
import CaptchaTermsAndService from './CaptchaTermsAndService'

export type CaptchaInvisibleProps = {
  children: (
    runCaptcha: () => Promise<string | null>,
    termsAndService: (className?: string) => JSX.Element
  ) => React.ReactNode
}

export default function CaptchaInvisible({ children }: CaptchaInvisibleProps) {
  const captchaRef = useRef<ReCAPTCHA>(null)
  const runCaptcha = async () => {
    let token: string | null = null
    try {
      console.log({ initToken: token })
      console.log({ captchaRef: captchaRef.current })
      token = (await captchaRef.current?.executeAsync()) ?? null
      console.log({ token })
    } catch (e) {
      console.error(e)
    }
    if (!token) {
      toast.custom((t) => (
        <Toast t={t} title='Captcha Failed' description='Please try again' />
      ))
      return null
    }
    captchaRef.current?.reset()
    return token
  }
  return (
    <>
      {children(runCaptcha, (className) => (
        <CaptchaTermsAndService className={className} />
      ))}
      <ReCAPTCHA
        sitekey={getCaptchaSiteKey()}
        theme='dark'
        ref={captchaRef}
        size='invisible'
        badge='inline'
      />
    </>
  )
}
