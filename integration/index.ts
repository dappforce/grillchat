type QueryParams = {
  order?: string
  theme?: string
  enableBackButton?: string
  enableLoginButton?: string
  autoFocus?: string
}

class QueryParamsBuilder {
  private query: URLSearchParams

  constructor() {
    this.query = new URLSearchParams()
    this.query.set('version', '0.1')
  }

  set(key: keyof QueryParams, value: string) {
    this.query.set(key, value)
    return this
  }

  get() {
    return this.query.toString()
  }
}

type Channel = {
  type: 'channel'
  id: string
  settings: {
    enableBackButton?: boolean
    enableLoginButton?: boolean
    autoFocus?: boolean
  }
}

export type GrillConfig = {
  widgetElementId?: string
  hub?: {
    /** The `space id` or `domain name` of your space. */
    id: string
  }
  channel?: Channel
  order?: string[]
  theme?: string
  onWidgetCreated?: (iframe: HTMLIFrameElement) => HTMLIFrameElement
}

const DEFAULT_CONFIG = {
  widgetElementId: 'grill',
  hub: { id: 'x' },
} satisfies GrillConfig

const DEFAULT_CHANNEL_SETTINGS: Channel['settings'] = {
  enableBackButton: false,
  enableLoginButton: false,
}

const grill = {
  instance: null as HTMLIFrameElement | null,

  init(config: GrillConfig) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    const widgetElement = document.getElementById(mergedConfig.widgetElementId)
    if (!widgetElement) {
      console.error(
        `Grill error: Element with id ${mergedConfig.widgetElementId} not found`
      )
      return
    }

    const iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.width = '100%'
    iframe.style.height = '100%'

    let baseUrl = `https://grill.chat/${mergedConfig.hub.id}`
    const channelConfig = mergedConfig.channel
    if (channelConfig) {
      baseUrl += `/${channelConfig.id}`
    }

    const query = new QueryParamsBuilder()

    if (mergedConfig.order) query.set('order', mergedConfig.order.join(','))
    if (mergedConfig.theme) query.set('theme', mergedConfig.theme)

    if (channelConfig) {
      const channelSettings = {
        ...DEFAULT_CHANNEL_SETTINGS,
        ...channelConfig.settings,
      }
      if (channelSettings.enableBackButton)
        query.set('enableBackButton', channelSettings.enableBackButton + '')
      if (channelSettings.enableLoginButton)
        query.set('enableLoginButton', channelSettings.enableLoginButton + '')
      if (channelSettings.autoFocus !== undefined)
        query.set('autoFocus', channelSettings.enableLoginButton + '')
    }

    iframe.src = `${baseUrl}?${query.get()}`

    if (mergedConfig.onWidgetCreated) {
      mergedConfig.onWidgetCreated?.(iframe)
    }

    this.instance?.remove()

    this.instance = iframe
    widgetElement.appendChild(iframe)
  },
}

export type Grill = typeof grill
;(window as any).GRILL = grill

export default grill
