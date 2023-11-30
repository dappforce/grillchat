import { useCaptchaContext } from '@/providers/CaptchaProvider'
import React from 'react'
import CaptchaTermsAndService from './CaptchaTermsAndService'

export type CaptchaInvisibleProps = {
  children: (
    runCaptcha: () => Promise<string | null>,
    termsAndService: (className?: string) => JSX.Element
  ) => React.ReactNode
}

export default function CaptchaInvisible({ children }: CaptchaInvisibleProps) {
  const { runCaptcha } = useCaptchaContext()

  return children(runCaptcha, (className) => (
    <CaptchaTermsAndService className={className} />
  ))
}
