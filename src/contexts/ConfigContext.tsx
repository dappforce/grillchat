import { Theme } from '@/@types/theme'
import { getUrlQuery } from '@/utils/links'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type State = {
  theme?: Theme
  order?: string[]
  enableBackButton?: boolean
  enableLoginButton?: boolean
  autoFocus?: boolean
}
const ConfigContext = createContext<State>({ theme: undefined, order: [] })

export function ConfigProvider({ children }: { children: any }) {
  const [state, setState] = useState<State>({
    theme: undefined,
    order: [],
  })

  const isAfterUpdate = useRef(false)
  useEffect(() => {
    isAfterUpdate.current = true
    setState(getConfig())
  }, [])

  useEffect(() => {
    if (!isAfterUpdate.current) return
    window.top?.postMessage('grill:ready', '*')
    isAfterUpdate.current = false
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
  validValues: string[],
  transformer: (value: string) => T = (value) => value as T
) {
  if (!validValues.includes(value)) return undefined
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
    const autoFocus = getUrlQuery('autoFocus')

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
      autoFocus: validateStringConfig(
        autoFocus,
        ['true', 'false'],
        (value) => value === 'true'
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
