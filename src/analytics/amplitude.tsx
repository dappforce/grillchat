import { getAmpId } from '@/utils/env/client'
import { createInstance } from '@amplitude/analytics-browser'
import { BrowserClient } from '@amplitude/analytics-types'
import React, { FC, useEffect } from 'react'

type AnalyticContextProps = {
  amp?: BrowserClient | null
}
const AnalyticContext = React.createContext<AnalyticContextProps>(
  {} as AnalyticContextProps
)

export default function useAnalytic() {
  const context = React.useContext(AnalyticContext)
  if (context === undefined) {
    throw new Error(`useAmplitude must be used within a AmplitudeContext`)
  }
  return context
}

export const AnalyticProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const [amp, setAmp] = React.useState<BrowserClient | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const amp = createInstance()
    amp
      .init(getAmpId())
      .promise.then(() => setAmp(amp))
      .catch(console.error)
  }, [])

  return (
    <AnalyticContext.Provider value={{ amp }}>
      {children}
    </AnalyticContext.Provider>
  )
}
