import { useAmplitude } from '@/analytics/amplitude'
import React, { FC, useMemo } from 'react'

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

  const updateUserId = async (address?: string) => {
    if (address) {
      const userIdArray = await crypto.subtle.digest(
        'SHA-256',
        Buffer.from(address)
      )
      const userId = Buffer.from(userIdArray).toString('hex')
      amp?.setUserId(userId)
      // TODO add GA user id
    } else {
      amp?.setUserId(undefined)
      // TODO remove GA user id
    }
  }

  const removeUserId = () => updateUserId(undefined)
  const setUserId = (address: string) => updateUserId(address)

  const sendEvent = (name: string, properties?: Record<string, string>) => {
    amp?.logEvent(name, properties)
    // TODO add GA events
  }

  const value = useMemo(() => ({ setUserId, removeUserId, sendEvent }), [!!amp])

  return (
    <AnalyticContext.Provider value={value}>
      {children}
    </AnalyticContext.Provider>
  )
}
