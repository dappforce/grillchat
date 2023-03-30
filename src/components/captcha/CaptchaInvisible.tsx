import { getCaptchaSiteKey } from '@/utils/env/client'
import React, { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
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
    return captchaRef.current?.executeAsync() ?? null
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
