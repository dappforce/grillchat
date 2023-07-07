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

const DEFAULT_WIDGET_ELEMENT_ID = 'grill'
const DEFAULT_CONFIG = {
  widgetElementId: DEFAULT_WIDGET_ELEMENT_ID,
  hub: { id: 'x' },
} satisfies GrillConfig

const DEFAULT_CHANNEL_SETTINGS: Channel['settings'] = {
  enableBackButton: false,
  enableLoginButton: false,
}

function createUrl(
  config: Pick<GrillConfig, 'hub' | 'channel'>,
  query?: QueryParamsBuilder
) {
  let url = `https://grill.chat/${config.hub.id}`
  const channelConfig = config.channel
  let resourceId: string | null = null
  let resourceMetadata: ResourceMetadata | null = null

  query = query || new QueryParamsBuilder()
  if (channelConfig) {
    switch (channelConfig.type) {
      case 'channel':
        url += `/${channelConfig.id}`
        break
      case 'resource':
        resourceId = channelConfig.resource.toResourceId()
        url += `/resource/${encodeURIComponent(resourceId)}`
        resourceMetadata = channelConfig.metadata
        break
      default:
        throw new Error('Unsupportable channel type')
    }
  }

  if (resourceMetadata) {
    try {
      query.set(
        'metadata',
        encodeURIComponent(JSON.stringify(resourceMetadata))
      )
    } catch (e) {
      throw new Error('Resource metadata has invalid value.')
    }
  }

  const fullUrl = `${url}?${query.get()}`

  return { url, query, fullUrl }
}

const grill = {
  instances: {} as Record<
    string,
    {
      iframe: HTMLIFrameElement | null
      isReady: boolean
      waitingCallbacks: (() => void)[]
    }
  >,

  init(config: GrillConfig) {
    const createInitError = (message: string) => new GrillError(message, 'init')

    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    const widgetElement = document.getElementById(mergedConfig.widgetElementId)
    if (!widgetElement) {
      throw createInitError(
        `Element with id ${mergedConfig.widgetElementId} not found`
      )
    }

    let iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.width = '100%'
    iframe.style.height = '100%'

    const channelConfig = mergedConfig.channel
    const { url: baseUrl, query } = createUrl(mergedConfig)

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

      if (channelSettings.enableInputAutofocus !== undefined)
        query.set(
          'enableInputAutofocus',
          channelSettings.enableInputAutofocus + ''
        )
    }

    iframe.src = `${baseUrl}?${query.get()}`
    iframe.allow = 'clipboard-write'

    if (mergedConfig.onWidgetCreated) {
      iframe = mergedConfig.onWidgetCreated?.(iframe)
    }

    this.instances[mergedConfig.widgetElementId]?.iframe?.remove()
    this.instances[mergedConfig.widgetElementId] = {
      iframe,
      isReady: false,
      waitingCallbacks: [],
    }

    iframe.style.opacity = '0'
    iframe.style.transition = 'opacity 0.15s ease-in-out'
    window.onmessage = (event) => {
      if (event.data === 'grill:ready') {
        iframe.style.opacity = '1'
        const currentInstance = this.instances[mergedConfig.widgetElementId]
        if (!currentInstance) return

        currentInstance.isReady = true
        currentInstance.waitingCallbacks.forEach((callback) => callback())
      }
    }

    widgetElement.appendChild(iframe)
  },

  setConfig(config: Pick<GrillConfig, 'widgetElementId' | 'hub' | 'channel'>) {
    const currentInstance =
      this.instances[config.widgetElementId || DEFAULT_WIDGET_ELEMENT_ID]
    if (!currentInstance)
      throw new GrillError('Instance not found', 'setConfig')

    const { fullUrl } = createUrl(config)
    const url = new URL(fullUrl)
    const pathnameWithQuery = url.pathname + url.search

    function sendSetConfigMessage() {
      if (!currentInstance) return
      currentInstance.iframe?.contentWindow?.postMessage(
        {
          type: 'grill:setConfig',
          payload: pathnameWithQuery,
        },
        '*'
      )
    }
    if (!currentInstance.isReady) {
      currentInstance.waitingCallbacks.push(sendSetConfigMessage)
      return
    }
    sendSetConfigMessage()
  },
}

export type Grill = typeof grill
if (typeof window !== 'undefined') {
  ;(window as any).GRILL = grill
}

export default grill

export class GrillError extends Error {
  constructor(message = '', method = '') {
    super(message)
    this.message = 'Grill Error: ' + (method ? `${method}: ` : '') + message
  }
}
