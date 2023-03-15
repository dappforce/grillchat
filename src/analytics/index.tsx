import { useAmplitude } from '@/analytics/amplitude'
import { event } from 'nextjs-google-analytics'
import React, { FC, useCallback, useMemo, useRef } from 'react'

type AnalyticContextProps = {
  sendEvent: (name: string, properties?: Record<string, string>) => void
  setUserId: (address: string) => void
  removeUserId: () => void
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
  const amp = useAmplitude()
  const userIdRef = useRef<string | undefined>()

  const updateUserId = useCallback(
    async (address: string | undefined) => {
      if (address) {
        const userIdArray = await crypto.subtle.digest(
          'SHA-256',
          Buffer.from(address)
        )
        const userId = Buffer.from(userIdArray).toString('hex')
        amp?.setUserId(userId)
        userIdRef.current = userId
      } else {
        amp?.setUserId(undefined)
        userIdRef.current = undefined
      }
    },
    [amp]
  )

  const removeUserId = useCallback(
    () => updateUserId(undefined),
    [updateUserId]
  )
  const setUserId = useCallback(
    (address: string) => updateUserId(address),
    [updateUserId]
  )

  const sendEvent = useCallback(
    (name: string, properties?: Record<string, string>) => {
      amp?.logEvent(name, properties)
      event(name, { userId: userIdRef.current })
    },
    [amp]
  )

  const value = useMemo(
    () => ({ setUserId, removeUserId, sendEvent }),
    [setUserId, removeUserId, sendEvent]
  )

  return (
    <AnalyticContext.Provider value={value}>
      {children}
    </AnalyticContext.Provider>
  )
}
