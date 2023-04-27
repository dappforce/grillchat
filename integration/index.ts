export type GrillChatConfig = {
  targetId?: string
  spaceId?: string
  order?: string[]
  theme?: string
  chatRoomId?: string
  customizeIframe?: (iframe: HTMLIFrameElement) => HTMLIFrameElement
}

const DEFAULT_CONFIG = {
  spaceId: 'x',
  targetId: 'grillchat',
} satisfies GrillChatConfig

const grillchat = {
  init: (params: GrillChatConfig) => {
    const config = { ...DEFAULT_CONFIG, ...params }
    const targetElement = document.getElementById(config.targetId)
    if (!targetElement) {
      console.error(
        `Grill.chat error: Element with id ${config.targetId} not found`
      )
      return
    }

    const iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.width = '100%'
    iframe.style.height = '100%'

    let baseUrl = `https://grill.chat/${config.spaceId}`
    if (config.chatRoomId) {
      baseUrl += `/c/${config.chatRoomId}`
    }

    const query = new URLSearchParams()
    if (config.order) query.set('order', config.order.join(','))
    if (config.theme) query.set('theme', config.theme)
    iframe.src = `${baseUrl}?${query.toString()}`

    if (config.customizeIframe) {
      config.customizeIframe?.(iframe)
    }

    targetElement.appendChild(iframe)
  },
}

export type GrillChat = typeof grillchat
;(window as any).grillchat = grillchat

export {}
