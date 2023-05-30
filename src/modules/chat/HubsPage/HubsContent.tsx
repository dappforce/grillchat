import ChatPreview from '@/components/chats/ChatPreview'
import { getAliasFromSpaceId } from '@/constants/chat-room'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { useSendEvent } from '@/stores/analytics'
import { getSpaceIds } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { SpaceData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { CommonHubContentProps, HubsPageProps } from './HubsPage'

export default function HubsContent({
  hubsChatCount = {},
  getSearchResults,
}: CommonHubContentProps & Pick<HubsPageProps, 'hubsChatCount'>) {
  const hubIds = getSpaceIds()

  const hubQueries = getSpaceQuery.useQueries(hubIds)
  const hubs = hubQueries.map(({ data: hub }) => hub)
  const { searchResults, focusedElementIndex } = getSearchResults(hubs, [
    'content.name',
  ])

  return (
    <div className='flex flex-col overflow-auto'>
      {searchResults.map((hub, idx) => {
        if (!hub) return null
        const hubId = hub.id
        return (
          <ChatPreviewContainer
            isFocused={idx === focusedElementIndex}
            hub={hub}
            chatCount={hubsChatCount[hubId]}
            key={hubId}
          />
        )
      })}
    </div>
  )
}

function ChatPreviewContainer({
  hub,
  isFocused,
  chatCount,
}: {
  hub: SpaceData
  isFocused?: boolean
  chatCount: number | undefined
}) {
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const path = getAliasFromSpaceId(hub.id) || hub.id
  const linkTo = `/${path}`

  const content = hub.content

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
    sendEvent(`click on hub`, {
      title: content?.name ?? '',
    })
  }

  return (
    <ChatPreview
      isImageCircle={false}
      onClick={onChatClick}
      asContainer
      asLink={{
        replace: isInIframe,
        href: linkTo,
      }}
      additionalDesc={chatCount ? `${chatCount} chats` : undefined}
      image={getIpfsContentUrl(content?.image ?? '')}
      title={content?.name ?? ''}
      description={content?.about ?? ''}
      withFocusedStyle={isFocused}
    />
  )
}
