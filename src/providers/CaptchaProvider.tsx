import Toast from '@/components/Toast'
import { getCaptchaSiteKey } from '@/utils/env/client'
import { createContext, useCallback, useContext, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { toast } from 'react-hot-toast'

type State = {
  captchaRef: React.RefObject<ReCAPTCHA | null> | null
  runCaptcha: () => Promise<string | null>
}
const CaptchaContext = createContext<State>({
  captchaRef: null,
  runCaptcha: () => Promise.resolve(null),
})

export function CaptchaProvider({ children }: { children: any }) {
  const captchaRef = useRef<ReCAPTCHA>(null)
  const siteKey = getCaptchaSiteKey()
  const captchaSiteKey = getCaptchaSiteKey()

  const runCaptcha = useCallback(async () => {
    if (!captchaSiteKey || !captchaRef?.current) return 'dummy-captcha'

    let token: string | null = null
    try {
      console.log('waiting captcha...')
      token = (await captchaRef?.current.executeAsync?.()) ?? null
      console.log('done captcha')
    } catch (e) {
      console.error('Captcha Error: ', e)
    }
    if (!token) {
      toast.custom((t) => (
        <Toast
          t={t}
          type='error'
          title='Captcha Failed'
          description='Please try again'
        />
      ))
      return null
    }

    captchaRef.current?.reset()
    return token
  }, [captchaRef, captchaSiteKey])

  return (
    <CaptchaContext.Provider value={{ captchaRef, runCaptcha }}>
      {siteKey && (
        <div className='hidden'>
          <ReCAPTCHA
            sitekey={siteKey}
            ref={captchaRef}
            theme='dark'
            size='invisible'
            badge='inline'
          />
        </div>
      )}
      {children}
    </CaptchaContext.Provider>
  )
}

export function useCaptchaContext() {
  return useContext(CaptchaContext)
}
