export type SelectedMessageActions = 'reply' | 'edit'
export type SelectedMessage = {
  id: string
  type: SelectedMessageActions
}
export type SendMessageParams = {
  message: string
  rootPostId: string
  selectedMessage?: {
    id: string
    type: SelectedMessageActions
  }
}
export type OptimisticMessageIdData = {
  address: string
  message: string
}
