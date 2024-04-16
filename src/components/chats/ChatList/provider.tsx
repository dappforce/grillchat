import { RefObject, createContext, useContext } from 'react'

export const ChatListContext = createContext<RefObject<HTMLDivElement> | null>(
  null
)
export function useChatListContext() {
  return useContext(ChatListContext)
}
