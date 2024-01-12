import { GrillConfig } from '@/../integration/index'
import { Theme } from '@/@types/theme'
import { getAmpId, getGaId } from '@/utils/env/client'
import { getUrlQuery } from '@/utils/links'
import { isServer } from '@tanstack/react-query'

export function getAugmentedGaId() {
  const { analytics } = getConfig()
  if (analytics === false) return undefined

  return analytics?.ga || getGaId()
}

export function getAugmentedAmpId() {
  const { analytics } = getConfig()
  if (analytics === false) return undefined

  return analytics?.amp || getAmpId()
}

export type ConfigContextState = {
  theme?: Theme
  order?: string[]
  defaultWallet?: {
    walletName: string
    address?: string
  }
  channels?: Set<string>
  rootFontSize?: string
  loginRequired?: boolean
  analytics?: false | { ga: string; amp: string }
  enableBackButton?: boolean
  enableLoginButton?: boolean
  enableInputAutofocus?: boolean
  subscribeMessageCountThreshold?: number
  customTexts?: GrillConfig['customTexts']
}

const latestVersion = '0.1'
type SchemaGetter = { [key: string]: () => ConfigContextState }
const schemaGetter = {
  '0.1': () => {
    const theme = getUrlQuery('theme')
    const order = getUrlQuery('order')
    const channels = getUrlQuery('channels')
    const rootFontSize = getUrlQuery('rootFontSize')
    const loginRequired = getUrlQuery('loginRequired')

    const enableBackButton = getUrlQuery('enableBackButton')
    const enableLoginButton = getUrlQuery('enableLoginButton')
    const enableInputAutofocus = getUrlQuery('enableInputAutofocus')

    const wallet = getUrlQuery('wallet')
    const address = getUrlQuery('address')

    const analyticsString = getUrlQuery('analytics')
    let analytics: ConfigContextState['analytics']
    if (analyticsString === 'false') {
      analytics = false
    } else {
      try {
        analytics = JSON.parse(decodeURIComponent(analyticsString)) as any
      } catch {}
    }

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
      analytics,
      defaultWallet: wallet
        ? {
            walletName: wallet,
            address,
          }
        : undefined,
      loginRequired: validateStringConfig(
        loginRequired,
        ['true', 'false'],
        (value) => value === 'true'
      ),
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

export function getConfig(): ConfigContextState {
  if (isServer) return {}

  const version = getUrlQuery('version')
  let getter = schemaGetter[version as keyof typeof schemaGetter]
  if (!getter) getter = schemaGetter[latestVersion]

  return getter()
}

function validateStringConfig<T = string>(
  value: string,
  validValues: string[] | null,
  transformer: (value: string) => T = (value) => value as T
) {
  if (validValues && !validValues.includes(value)) return undefined
  return transformer(value)
}
