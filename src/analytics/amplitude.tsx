import { getAmpId } from '@/utils/env/client'
import { createInstance } from '@amplitude/analytics-browser'
import { BrowserClient } from '@amplitude/analytics-types'
import React, { useEffect } from 'react'

export const useAmplitude = () => {
  const [amp, setAmp] = React.useState<BrowserClient | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ampId = getAmpId()
    if (!ampId) return

    const amp = createInstance()
    amp
      .init(getAmpId(), undefined, { disableCookies: true })
      .promise.then(() => setAmp(amp))
      .catch(console.error)
  }, [])

  return amp
}
