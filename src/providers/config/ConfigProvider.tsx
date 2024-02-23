import { env } from '@/env.mjs'
import { getCurrentUrlOrigin } from '@/utils/links'
import { sendMessageToParentWindow } from '@/utils/window'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import urlJoin from 'url-join'
import { ConfigContextState, getConfig } from './utils'

const ConfigContext = createContext<ConfigContextState>({
  theme: undefined,
  order: [],
})

export function ConfigProvider({ children }: { children: any }) {
  const [state, setState] = useState<ConfigContextState>({
    theme: undefined,
    order: [],
  })
  const { push } = useRouter()

  const configRef = useRef<ConfigContextState | null>(null)
  useEffect(() => {
    const config = getConfig()
    setState(config)
    configRef.current = config
  }, [])

  useEffect(() => {
    const handler = async (event: MessageEvent) => {
      const eventData = event.data
      if (eventData && eventData.type === 'grill:setConfig') {
        const payload = eventData.payload as string
        const currentPathnameAndQuery = window.location.href.replace(
          urlJoin(getCurrentUrlOrigin(), env.NEXT_PUBLIC_BASE_PATH),
          ''
        )
        const payloadPathname = payload.replace(
          new RegExp(`^${env.NEXT_PUBLIC_BASE_PATH}`),
          ''
        )
        if (
          payloadPathname &&
          !payloadPathname.startsWith('http') &&
          payloadPathname !== currentPathnameAndQuery
        ) {
          sendMessageToParentWindow('isUpdatingConfig', 'true')
          await push(payloadPathname)
          sendMessageToParentWindow('isUpdatingConfig', 'false')
        }
      }
    }
    window.addEventListener('message', handler)

    return () => {
      window.removeEventListener('message', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // check if current state is updated to the read config
    if (configRef.current === state) {
      window.parent?.postMessage('grill:ready', '*')
    }
  }, [state])

  return (
    <>
      <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
      {state.rootFontSize && (
        <style jsx global>{`
          :root {
            font-size: ${state.rootFontSize};
          }
        `}</style>
      )}
    </>
  )
}

export function useConfigContext() {
  return useContext(ConfigContext)
}
