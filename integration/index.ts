export type GrillConfig = {
  targetId?: string
  spaceId?: string
  order?: string[]
  theme?: string
  chatRoomId?: string
  customizeIframe?: (iframe: HTMLIFrameElement) => HTMLIFrameElement
}

const DEFAULT_CONFIG = {
  spaceId: 'x',
  targetId: 'grill',
} satisfies GrillConfig

const grill = {
  instance: null as HTMLIFrameElement | null,

  init(config: GrillConfig) {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config }
    const targetElement = document.getElementById(mergedConfig.targetId)
    if (!targetElement) {
      console.error(
        `Grill error: Element with id ${mergedConfig.targetId} not found`
      )
      return
    }

    const iframe = document.createElement('iframe')
    iframe.style.border = 'none'
    iframe.style.width = '100%'
    iframe.style.height = '100%'

    let baseUrl = `https://grill.chat/${mergedConfig.spaceId}`
    if (mergedConfig.chatRoomId) {
      baseUrl += `/${mergedConfig.chatRoomId}`
    }

    const query = new URLSearchParams()
    if (mergedConfig.order) query.set('order', mergedConfig.order.join(','))
    if (mergedConfig.theme) query.set('theme', mergedConfig.theme)
    iframe.src = `${baseUrl}?${query.toString()}`

    if (mergedConfig.customizeIframe) {
      mergedConfig.customizeIframe?.(iframe)
    }

    this.instance?.remove()

    this.instance = iframe
    targetElement.appendChild(iframe)
  },
}

export type Grill = typeof grill
;(window as any).GRILL = grill

export default grill
