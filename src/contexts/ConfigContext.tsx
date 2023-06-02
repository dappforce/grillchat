import { Theme } from '@/@types/theme'
import { getUrlQuery } from '@/utils/links'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type State = {
  theme?: Theme
  order?: string[]
  enableBackButton?: boolean
  enableLoginButton?: boolean
  enableInputAutofocus?: boolean
  subscribeMessageCountThreshold?: number
}
const ConfigContext = createContext<State>({ theme: undefined, order: [] })

export function ConfigProvider({ children }: { children: any }) {
  const [state, setState] = useState<State>({
    theme: undefined,
    order: [],
  })

  const configRef = useRef<State | null>(null)
  useEffect(() => {
    const config = getConfig()
    setState(config)
    configRef.current = config
  }, [])

  useEffect(() => {
    // check if current state is updated to the read config
    if (configRef.current === state) {
      window.parent?.postMessage('grill:ready', '*')
    }
  }, [state])

  return (
    <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
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
    const enableBackButton = getUrlQuery('enableBackButton')
    const enableLoginButton = getUrlQuery('enableLoginButton')
    const enableInputAutofocus = getUrlQuery('enableInputAutofocus')

    const subscribeMessageCountThreshold = getUrlQuery(
      'subscribeMessageCountThreshold'
    )

    const usedOrder = order.split(',').filter((value) => !!value)

    return {
      order: usedOrder,
      theme: validateStringConfig(theme, ['dark', 'light']),
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
    }
  },
} satisfies SchemaGetter

function getConfig() {
  const version = getUrlQuery('version')
  let getter = schemaGetter[version as keyof typeof schemaGetter]
  if (!getter) getter = schemaGetter[latestVersion]

  return getter()
}
