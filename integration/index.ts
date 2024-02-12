type QueryParams = {
  parent?: string
  order?: string
  theme?: string
  rootFontSize?: string
  resourceId?: string
  metadata?: string
  enableBackButton?: string
  enableLoginButton?: string
  enableInputAutofocus?: string
  customTexts?: string
  analytics?: string
  loginRequired?: string
  wallet?: string
  address?: string
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

type CustomTextConfig = {
  /** The text to show when there is no message in the channel. Defaults to `No messages here yet` */
  noTextInChannel?: string
  /** The text in button that shows if channel is not created yet when you use channel type `resource`. Defaults to `Start Discussion`  */
  createChannelButton?: string
}

type Theme = 'light' | 'dark'
export type GrillConfig = {
  /** The `id` of the div that you want to render the chat to. Default to `grill` */
  widgetElementId?: string
  /** Info of the space you want to use */
  hub?: {
    /** The `space id` or `domain name` of your space. */
    id: string
  }
  /** Custom texts to customize the chat based on your needs. */
  customTexts?: CustomTextConfig
  /** Option to make the iframe open chat room (a channel) directly */
  channel?: Channel
  order?: string[]
  /** The root font size of the whole page. You can change it if you want all font sizes to be smaller/bigger. Default root font size is 1rem (16px). For example, you can change it to 0.875rem to make it 14px, or just straight up use 14px. */
  rootFontSize?: string
  /** The theme of the chat. If omitted, it will use the system preferences or user's last theme used in <https://grill.so> */
  theme?: Theme
  /** You can set this to `true` if you want user who uses the iframe must login via wallet or their own grill key (no anon login) */
  loginRequired?: boolean
  /** You can turn off the analytics of grill by providing the value to `false`, or change it to use your own analytics id. We use google analytics (ga) and amplitude (amp). This option is only used in the `init` process */
  analytics?: false | { ga?: string; amp?: string }
  /** This option is for enabling user to directly selecting the given wallet choice, instead of clicking through multiple options.
   * This is useful for crypto projects where user can login with their wallet, so you can provide the user's wallet option and make the login process faster for the user */
  defaultWallet?: { wallet?: string; address?: string }
  /** A function that will be called when the iframe is created. You can use this to customize the iframe attributes. */
  onWidgetCreated?: (iframe: HTMLIFrameElement) => HTMLIFrameElement
}

const DEFAULT_WIDGET_ELEMENT_ID = 'grill'
const DEFAULT_CONFIG = {
  widgetElementId: DEFAULT_WIDGET_ELEMENT_ID,
  hub: { id: 'featured' },
} satisfies GrillConfig

const DEFAULT_CHANNEL_SETTINGS: Channel['settings'] = {
  enableBackButton: false,
  enableLoginButton: false,
}

function createUrl(
  config: Required<Pick<GrillConfig, 'hub'>> & Pick<GrillConfig, 'channel'>,
  query?: QueryParamsBuilder
) {
  let url = `https://grill.so/widget/${config.hub.id}`
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

// to make the autocomplete still appears, but enables any string to be passed in
type KnownEvents =
  | 'ready'
  | 'unread'
  | 'totalMessage'
  | 'isUpdatingConfig'
  | (string & {})
export type GrillEventListener = (eventName: KnownEvents, value: string) => void
const grill = {
  instances: {} as Record<
    string,
    {
      iframe: HTMLIFrameElement | null
      isReady: boolean
      waitingCallbacks: (() => void)[]
    }
  >,
  eventListeners: [] as GrillEventListener[],

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
    if (mergedConfig.rootFontSize)
      query.set('rootFontSize', mergedConfig.rootFontSize)
    if (mergedConfig.analytics !== undefined)
      query.set(
        'analytics',
        mergedConfig.analytics === false
          ? 'false'
          : JSON.stringify(mergedConfig.analytics)
      )
    if (mergedConfig.loginRequired !== undefined)
      query.set('loginRequired', mergedConfig.loginRequired + '')
    if (mergedConfig.defaultWallet) {
      query.set('wallet', mergedConfig.defaultWallet.wallet ?? '')
      query.set('address', mergedConfig.defaultWallet?.address ?? '')
    }

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

    if (mergedConfig.customTexts) {
      query.set(
        'customTexts',
        encodeURIComponent(JSON.stringify(mergedConfig.customTexts))
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
      const message = parseMessage(event.data + '')
      if (!message) return

      const { name, value } = message
      if (name === 'ready') {
        iframe.style.opacity = '1'
        const currentInstance = this.instances[mergedConfig.widgetElementId]
        if (!currentInstance) return

        currentInstance.isReady = true
        currentInstance.waitingCallbacks.forEach((callback) => callback())
      }

      if (name) this.eventListeners.forEach((listener) => listener(name, value))
    }

    widgetElement.appendChild(iframe)
  },

  setConfig(config: Pick<GrillConfig, 'widgetElementId' | 'hub' | 'channel'>) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    const currentInstance =
      this.instances[mergedConfig.widgetElementId || DEFAULT_WIDGET_ELEMENT_ID]
    if (!currentInstance)
      throw new GrillError('Instance not found', 'setConfig')

    const { fullUrl } = createUrl(mergedConfig)
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

  addMessageListener(listener: GrillEventListener) {
    this.eventListeners.push(listener)
  },
  removeMessageListener(listener: GrillEventListener) {
    this.eventListeners = this.eventListeners.filter((l) => l !== listener)
  },
}

function parseMessage(data: string) {
  const [origin, name, value] = data.split(':')
  if (origin !== 'grill') return null
  return { name: name ?? '', value: value ?? '' }
}

export type Grill = Omit<
  typeof grill,
  'unreadCountListeners' | 'currentUnreadCount'
>
if (typeof window !== 'undefined') {
  ;(window as any).GRILL = grill as Grill
}

export default grill as Grill

export class GrillError extends Error {
  constructor(message = '', method = '') {
    super(message)
    this.message = 'Grill Error: ' + (method ? `${method}: ` : '') + message
  }
}
