import { getAliasFromHubId, getPinnedChatsInHubId } from '@/constants/hubs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { useSendEvent } from '@/stores/analytics'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { ComponentProps } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import ChatPreview from './ChatPreview'

export type ChatPreviewListProps = ComponentProps<'div'> & {
  chats: (PostData | undefined | null)[]
  focusedElementIndex?: number
  hubId?: string
}

export default function ChatPreviewList({
  chats,
  focusedElementIndex,
  hubId,
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
            hubId={hubId}
          />
        )
      })}
    </div>
  )
}

function ChatPreviewContainer({
  chat,
  isFocused,
  hubId,
}: {
  chat: PostData
  isFocused?: boolean
  hubId?: string
}) {
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const content = chat?.content

  const usedHubId = hubId || chat.struct.spaceId
  const aliasOrHub = getAliasFromHubId(hubId ?? '') || usedHubId
  const linkTo = getChatPageLink(
    router,
    createSlug(chat.id, { title: content?.title }),
    aliasOrHub
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

  const isPinned = getPinnedChatsInHubId(usedHubId ?? '').includes(chat.id)

  return (
    <ChatPreview
      onClick={onChatClick}
      asContainer
      asLink={{
        replace: isInIframe,
        href: linkTo,
      }}
      image={content?.image && getIpfsContentUrl(content.image)}
      title={content?.title}
      description={content?.body}
      chatId={chat.id}
      hubId={usedHubId}
      isPinned={isPinned}
      withUnreadCount
      withFocusedStyle={isFocused}
    />
  )
}
