type OpenCommConfig = {
  targetId?: string
  spaceId?: string
  order?: string[]
  theme?: string
  chatRoomId?: string
  customizeIframe?: (iframe: HTMLIFrameElement) => HTMLIFrameElement
}
declare const opencomm: {
  instance: HTMLIFrameElement | null
  init(params: OpenCommConfig): void
}
type OpenComm = typeof opencomm

export { OpenComm, OpenCommConfig, opencomm as default }
