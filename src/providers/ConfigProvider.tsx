import { GrillConfig } from '@/../integration/index'
import { Theme } from '@/@types/theme'
import { getCurrentUrlOrigin, getUrlQuery } from '@/utils/links'
import { sendMessageToParentWindow } from '@/utils/window'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type State = {
  theme?: Theme
  order?: string[]
  defaultWallet?: {
    walletName: string
    address?: string
  }
  channels?: Set<string>
  rootFontSize?: string
  enableBackButton?: boolean
  enableLoginButton?: boolean
  enableInputAutofocus?: boolean
  subscribeMessageCountThreshold?: number
  customTexts?: GrillConfig['customTexts']
}
const ConfigContext = createContext<State>({ theme: undefined, order: [] })

export function ConfigProvider({ children }: { children: any }) {
  const [state, setState] = useState<State>({
    theme: undefined,
    order: [],
  })
  const { push } = useRouter()

  const configRef = useRef<State | null>(null)
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
          getCurrentUrlOrigin(),
          ''
        )
        if (
          payload &&
          !payload.startsWith('http') &&
          payload !== currentPathnameAndQuery
        ) {
          sendMessageToParentWindow('isUpdatingConfig', 'true')
          await push(payload)
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

function validateStringConfig<T = string>(
  value: string,
  validValues: string[] | null,
  transformer: (value: string) => T = (value) => value as T
) {
  if (validValues && !validValues.includes(value)) return undefined
  return transformer(value)
}

const latestVersion = '0.1'
type SchemaGetter = { [key: string]: () => State }
const schemaGetter = {
  '0.1': () => {
    const theme = getUrlQuery('theme')
    const order = getUrlQuery('order')
    const channels = getUrlQuery('channels')
    const rootFontSize = getUrlQuery('rootFontSize')

    const enableBackButton = getUrlQuery('enableBackButton')
    const enableLoginButton = getUrlQuery('enableLoginButton')
    const enableInputAutofocus = getUrlQuery('enableInputAutofocus')

    const wallet = getUrlQuery('wallet')
    const address = getUrlQuery('address')

    const customTextsString = getUrlQuery('customTexts')
    let customTexts: GrillConfig['customTexts']
    if (customTextsString) {
      try {
        customTexts = JSON.parse(decodeURIComponent(customTextsString)) as any
      } catch (err) {
        customTexts = undefined
      }
    }

    const subscribeMessageCountThreshold = getUrlQuery(
      'subscribeMessageCountThreshold'
    )

    const usedChannels = new Set(channels.split(',').filter((value) => !!value))
    const usedOrder = order.split(',').filter((value) => !!value)

    return {
      order: usedOrder,
      channels: usedChannels.size > 0 ? usedChannels : undefined,
      theme: validateStringConfig(theme, ['dark', 'light']),
      rootFontSize,
      defaultWallet: wallet
        ? {
            walletName: wallet,
            address,
          }
        : undefined,
      enableBackButton: validateStringConfig(
        enableBackButton,
        ['true', 'false'],
        (value) => value === 'true'
      ),
      enableLoginButton: validateStringConfig(
        enableLoginButton,
        ['true', 'false'],
        (value) => value === 'true'
      ),
      enableInputAutofocus: validateStringConfig(
        enableInputAutofocus,
        ['true', 'false'],
        (value) => value === 'true'
      ),
      subscribeMessageCountThreshold: validateStringConfig(
        subscribeMessageCountThreshold,
        null,
        (value) => {
          const parsedValue = parseInt(value)
          if (isNaN(parsedValue)) return undefined
          return parsedValue
        }
      ),
      customTexts,
    }
  },
} satisfies SchemaGetter

function getConfig() {
  const version = getUrlQuery('version')
  let getter = schemaGetter[version as keyof typeof schemaGetter]
  if (!getter) getter = schemaGetter[latestVersion]

  return getter()
}
