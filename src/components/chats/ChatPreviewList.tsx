import useIsInIframe from '@/hooks/useIsInIframe'
import { useSendEvent } from '@/stores/analytics'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import ChatPreview from './ChatPreview/ChatPreview'

export type ChatPreviewListProps = ComponentProps<'div'> & {
  chats: (PostData | undefined | null)[]
  focusedElementIndex?: number
}

export default function ChatPreviewList({
  chats,
  focusedElementIndex,
}: ChatPreviewListProps) {
  return (
    <div className='flex flex-col'>
      {chats.map((chat, idx) => {
        if (!chat) return null
        return (
          <ChatPreviewContainer
            isFocused={idx === focusedElementIndex}
            chat={chat}
            key={chat.id}
          />
        )
      })}
    </div>
  )
}

function ChatPreviewContainer({
  chat,
  isFocused,
}: {
  chat: PostData
  isFocused?: boolean
}) {
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const content = chat?.content

  const linkTo = getChatPageLink(
    router,
    createSlug(chat.id, { title: content?.title })
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
    sendEvent(`click on chat`, {
      title: content?.title ?? '',
      chatId: chat.id,
    })
  }

  return (
    <ChatPreview
      onClick={onChatClick}
      asContainer
      asLink={{
        replace: isInIframe,
        href: linkTo,
      }}
      image={content?.image ? getIpfsContentUrl(content.image) : ''}
      title={content?.title ?? ''}
      description={content?.body ?? ''}
      chatId={chat.id}
      withUnreadCount
      withFocusedStyle={isFocused}
    />
  )
}
