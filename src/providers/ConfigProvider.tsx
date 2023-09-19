import { Theme } from '@/@types/theme'
import { DEFAULT_FEATURE_CONFIG } from '@/constants/config'
import { getCurrentUrlOrigin, getUrlQuery } from '@/utils/links'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

type State = {
  theme?: Theme
  order?: string[]
  channels?: Set<string>
  rootFontSize?: string
  enableBackButton?: boolean
  enableLoginButton?: boolean
  enableInputAutofocus?: boolean
  subscribeMessageCountThreshold?: number
  enableNft: boolean
  enableEvmLinking: boolean
  enableDonations: boolean
}

function processState(state: State) {
  // Check all config with feature config so its enabled only if both are config from url and constant are enabled
  Object.entries(DEFAULT_FEATURE_CONFIG).forEach(([key, value]) => {
    const parsedKey = key as keyof State
    if (state[parsedKey]) {
      ;(state[parsedKey] as any) = state[parsedKey] && value
    }
  })
  state.enableDonations = state.enableEvmLinking && state.enableDonations
  return state
}

const ConfigContext = createContext<State>({
  theme: undefined,
  order: [],
  ...DEFAULT_FEATURE_CONFIG,
})

export function ConfigProvider({ children }: { children: any }) {
  const [state, setState] = useState<State>(() =>
    processState({
      theme: undefined,
      order: [],
      ...DEFAULT_FEATURE_CONFIG,
    })
  )
  const { push } = useRouter()

  const configRef = useRef<State | null>(null)
  useEffect(() => {
    const config = getConfig()
    setState(processState(config))
    configRef.current = config
  }, [])

  useEffect(() => {
    const handler = (event: MessageEvent) => {
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
        )
          push(payload)
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

    const subscribeMessageCountThreshold = getUrlQuery(
      'subscribeMessageCountThreshold'
    )

    const enableNft = getUrlQuery('enableNft')
    const enableEvmLinking = getUrlQuery('enableEvmLinking')
    const enableDonations = getUrlQuery('enableDonations')

    const usedChannels = new Set(channels.split(',').filter((value) => !!value))
    const usedOrder = order.split(',').filter((value) => !!value)

    return {
      order: usedOrder,
      channels: usedChannels.size > 0 ? usedChannels : undefined,
      theme: validateStringConfig(theme, ['dark', 'light']),
      rootFontSize,
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
      enableNft:
        validateStringConfig(
          enableNft,
          ['true', 'false'],
          (value) => value === 'true'
        ) ?? true,
      enableEvmLinking:
        validateStringConfig(
          enableEvmLinking,
          ['true', 'false'],
          (value) => value === 'true'
        ) ?? true,
      enableDonations:
        validateStringConfig(
          enableDonations,
          ['true', 'false'],
          (value) => value === 'true'
        ) ?? true,
    }
  },
} satisfies SchemaGetter

function getConfig() {
  const version = getUrlQuery('version')
  let getter = schemaGetter[version as keyof typeof schemaGetter]
  if (!getter) getter = schemaGetter[latestVersion]

  return getter()
}
