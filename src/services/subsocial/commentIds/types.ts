import { Extension } from '@/@types/subsocial'

export type SendMessageParams = {
  message?: string
  chatId: string
  replyTo?: string
  extensions?: Extension[]
}
export type OptimisticMessageIdData = {
  address: string
  message?: string
}
