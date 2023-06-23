import ChatPreviewList from '@/components/chats/ChatPreviewList'
import useSortedChats from '../hooks/useSortedChats'

export type HotChatsContentProps = {
  hubId: string
}

export default function HotChatsContent({ hubId }: HotChatsContentProps) {
  const { chats } = useSortedChats(hubId)

  return <ChatPreviewList chats={chats} hubId={hubId} />
}
