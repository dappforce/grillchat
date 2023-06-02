import {
  AddMessageAction,
  ChatRequest,
  GetMessagesAction,
  GetMessagesPayload,
  SetRoomsAction,
  SetRoomsPayload,
  SignedChatMessage,
} from './types'

function newChatRequest(req: ChatRequest) {
  return JSON.stringify(req)
}

export function newSetRoomsRequest(params: SetRoomsPayload) {
  return newChatRequest({
    action: SetRoomsAction,
    payload: params,
  })
}

export function newGetMessagesRequest(params: GetMessagesPayload) {
  return newChatRequest({
    action: GetMessagesAction,
    payload: params,
  })
}

export function newAddMessageRequest(signedMessage: SignedChatMessage) {
  return newChatRequest({
    action: AddMessageAction,
    payload: signedMessage,
  })
}
