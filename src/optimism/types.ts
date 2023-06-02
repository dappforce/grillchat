/** Substrate account id. */
type Account = string

/** Id of a post saved on blockchain. */
type PostId = string

/** Id of a chat room represented by a persistent post id. */
export type RoomId = PostId

/** IPFS CID */
type ContentId = string

type InReplyTo = {
  kind: 'Post'
  /** Post id of an older message that is saved on blockchain to which this message is replying to. */
  id: PostId
}

export type ChatMessageContent = {
  /** Unique id to link optimisitic and blockchain posts. */
  uuid: string
  body: string
  inReplyTo?: InReplyTo
}

export type ChatMessage = {
  /** An id of a root post that represents a chat room id. */
  roomId: PostId
  content: ChatMessageContent
  contentId: ContentId
}

export type SignedChatMessage = {
  /** An author of the message */
  account: Account // TODO rename to address?
  message: ChatMessage
  signature: string
}

export type OptimisticChatMessage = ChatMessage & {
  /** An author of the message. */
  account: Account
  /** A time in milliseconds when the message was received by server. */
  receivedAt: number
}

// Types of Request & Response for the web socket chat.
// ------------------------------

export const SetRoomsAction = 'SetRooms'
export const AddMessageAction = 'AddMessage'
export const GetMessagesAction = 'GetMessages'

type SetRoomsAction = 'SetRooms'
type AddMessageAction = 'AddMessage'
type GetMessagesAction = 'GetMessages'

type ChatRequestType = SetRoomsAction | AddMessageAction | GetMessagesAction

type GenericChatRequest<A extends ChatRequestType, P> = {
  action: A
  payload: P
}

export type SetRoomsPayload = {
  roomIds: RoomId[]
}

export type GetMessagesPayload = {
  roomIds: RoomId[]
  limitPerRoom?: number
}

export type AddMessagePayload = SignedChatMessage

export type SetRoomsRequest = GenericChatRequest<
  SetRoomsAction,
  SetRoomsPayload
>
export type AddMessageRequest = GenericChatRequest<
  AddMessageAction,
  SignedChatMessage
>
export type GetMessagesRequest = GenericChatRequest<
  GetMessagesAction,
  GetMessagesPayload
>

export type ChatRequest =
  | SetRoomsRequest
  | AddMessageRequest
  | GetMessagesRequest

// TODO validate requests against a JSON schemas

export function isSetRoomsRequest(req: ChatRequest): req is SetRoomsRequest {
  return req.action === SetRoomsAction
}

export function isAddMessageRequest(
  req: ChatRequest
): req is AddMessageRequest {
  return req.action === AddMessageAction
}

export function isGetMessagesRequest(
  req: ChatRequest
): req is GetMessagesRequest {
  return req.action === GetMessagesAction
}

export type MessagesByRoomResponse = Record<RoomId, OptimisticChatMessage[]>
