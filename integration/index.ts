type QueryParams = {
  parent?: string
  order?: string
  theme?: string
  resourceId?: string
  metadata?: string
  enableBackButton?: string
  enableLoginButton?: string
  enableInputAutofocus?: string
}

type ResourceLike = { toResourceId: () => string }
type ResourceMetadata = { title: string; body?: string; image?: string }

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

type ChannelSettings = {
  /** If set to `true`, it will show the back button in the channel iframe. Default to `false` */
  enableBackButton?: boolean
  /** If set to `true`, it will show the login button in the channel iframe. Default to `false` */
  enableLoginButton?: boolean
  /** If set to `true`, it will autofocus on the message input when the iframe is loaded. The default behavior is `true`, except on touch devices. If set `true`, it will autofocus the input on all devices. */
  enableInputAutofocus?: boolean
}

type ChanelTypeChannel = {
  /** The type of the channel. This should be set to `'channel'` */
  type: 'channel'
  /** The id of the channel. This should be the post id of the topic that you want to open */
  id: string
}
type ChanelTypeResource = {
  /** The type of the channel. This should be set to `'channel'` */
  type: 'resource'
  /** The Resource instance of the channel. This should be created from @subsocial/resource-discussions if necessary */
  resource: ResourceLike
  /** The metadata for new channel, if it's not existing and will be created automatically. */
  metadata: ResourceMetadata
}

type Channel = { settings?: ChannelSettings } & (
  | ChanelTypeChannel
  | ChanelTypeResource
)

type Theme = 'light' | 'dark'
export type GrillConfig = {
  /** The `id` of the div that you want to render the chat to. Default to `grill` */
  widgetElementId?: string
  /** Info of the space you want to use */
  hub: {
    /** The `space id` or `domain name` of your space. */
    id: string
  }
  /** Option to make the iframe open chat room (a channel) directly */
  channel?: Channel
  order?: string[]
  /** The theme of the chat. If omitted, it will use the system preferences or user's last theme used in <https://grill.chat> */
  theme?: Theme
  /** A function that will be called when the iframe is created. You can use this to customize the iframe attributes. */
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
    let resourceId: string | null = null
    let resourceMetadata: ResourceMetadata | null = null

    if (channelConfig) {
      switch (channelConfig.type) {
        case 'channel':
          baseUrl += `/${channelConfig.id}`
          break
        case 'resource':
          resourceId = channelConfig.resource.toResourceId()
          baseUrl += `/resource/${encodeURIComponent(resourceId)}`
          resourceMetadata = channelConfig.metadata
          break
        default:
          throw new Error('Unsupportable channel type')
      }
    }

    const query = new QueryParamsBuilder()

    query.set('parent', window.location.origin)
    if (mergedConfig.order) query.set('order', mergedConfig.order.join(','))
    if (mergedConfig.theme) query.set('theme', mergedConfig.theme)

    if (channelConfig) {
      const channelSettings = {
        ...DEFAULT_CHANNEL_SETTINGS,
        ...channelConfig.settings,
      }

      query.set('enableBackButton', channelSettings.enableBackButton + '')
      query.set('enableLoginButton', channelSettings.enableLoginButton + '')

      if (resourceMetadata)
        try {
          query.set(
            'metadata',
            encodeURIComponent(JSON.stringify(resourceMetadata))
          )
        } catch (e) {
          throw new Error('Resource metadata has invalid value.')
        }

      if (channelSettings.enableInputAutofocus !== undefined)
        query.set(
          'enableInputAutofocus',
          channelSettings.enableInputAutofocus + ''
        )
    }

    iframe.src = `${baseUrl}?${query.get()}`
    iframe.allow = 'clipboard-write'

    if (mergedConfig.onWidgetCreated) {
      mergedConfig.onWidgetCreated?.(iframe)
    }

    this.instance?.remove()

    this.instance = iframe

    iframe.style.opacity = '0'
    iframe.style.transition = 'opacity 0.15s ease-in-out'
    window.onmessage = (event) => {
      if (event.data === 'grill:ready') {
        iframe.style.opacity = '1'
      }
    }

    widgetElement.appendChild(iframe)
  },
}

export type Grill = typeof grill
if (typeof window !== 'undefined') {
  ;(window as any).GRILL = grill
}

export default grill
