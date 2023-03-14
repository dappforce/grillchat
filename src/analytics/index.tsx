import { useAmplitude } from '@/analytics/amplitude'
import { getSalt } from '@/utils/salt'
import React, { FC, useMemo } from 'react'

type AnalyticContextProps = {
  sendEvent: (name: string, properties?: Record<string, string>) => void
  setUserId: (address: string) => void
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

  const setUserId = async (address: string) => {
    const key = `${address}-${getSalt()}`
    const userIdArray = await crypto.subtle.digest('SHA-256', Buffer.from(key))
    const userId = Buffer.from(userIdArray).toString('hex')
    amp?.setUserId(userId)
    // TODO add GA user id
  }

  const sendEvent = (name: string, properties?: Record<string, string>) => {
    amp?.logEvent(name, properties)
    // TODO add GA events
  }

  const value = useMemo(() => ({ setUserId, sendEvent }), [!!amp])

  return (
    <AnalyticContext.Provider value={value}>
      {children}
    </AnalyticContext.Provider>
  )
}
