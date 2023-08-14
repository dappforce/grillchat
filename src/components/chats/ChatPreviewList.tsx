import { ANN_CHAT_ID } from '@/constants/chat'
import { getPinnedChatsInHubId } from '@/constants/hubs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { useSendEvent } from '@/stores/analytics'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import ChatPreview, { ChatPreviewProps } from './ChatPreview'

export type ChatPreviewListProps = ComponentProps<'div'> &
  Pick<ChatPreviewProps, 'chatInfo' | 'hubId'> & {
    chats: (PostData | undefined | null)[]
    focusedElementIndex?: number
  }

export default function ChatPreviewList({
  chats,
  focusedElementIndex,
  chatInfo,
  hubId,
}: ChatPreviewListProps) {
  return (
    <div className='flex flex-col'>
      {chats.map((chat, idx) => {
        if (!chat) return null
        return (
          <ChatPreviewContainer
            chatInfo={chatInfo}
            isFocused={idx === focusedElementIndex}
            chat={chat}
            key={chat.id}
            hubId={hubId}
          />
        )
      })}
    </div>
  )
}

type ChatPreviewContainerProps = Pick<ChatPreviewListProps, 'chatInfo'> & {
  chat: PostData
  isFocused?: boolean
  hubId?: string
}
function ChatPreviewContainer({
  chat,
  isFocused,
  hubId,
  chatInfo,
}: ChatPreviewContainerProps) {
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const content = chat?.content

  const usedHubId = hubId || chat.struct.spaceId
  const linkTo = getChatPageLink(
    router,
    createSlug(chat.id, { title: content?.title }),
    usedHubId
  )

  useHotkeys(
    'enter',
    () => {
      const method = isInIframe ? 'replace' : 'push'
      router[method](linkTo)
    },
    {
      enabled: isFocused,
      preventDefault: true,
      enableOnFormTags: ['INPUT'],
      keydown: true,
    }
  )

  const onChatClick = () => {
    sendEvent(`open_chat`, {
      chatId: chat.id,
    })

    if (chat.id === ANN_CHAT_ID) {
      sendEvent(`open_ann_chat`, {
        eventSource: 'pinned-chat',
      })
    }
  }

  const isPinned = getPinnedChatsInHubId(usedHubId ?? '').includes(chat.id)

  return (
    <ChatPreview
      onClick={onChatClick}
      asContainer
      asLink={{
        replace: isInIframe,
        href: linkTo,
      }}
      isHidden={chat.struct.hidden}
      image={content?.image}
      title={content?.title}
      description={content?.body}
      chatId={chat.id}
      hubId={usedHubId}
      isPinned={isPinned}
      withUnreadCount
      withFocusedStyle={isFocused}
      chatInfo={chatInfo}
    />
  )
}
