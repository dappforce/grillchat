import ChatPreview from '@/components/chats/ChatPreview'
import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import { getAliasFromHubId } from '@/constants/hubs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { useSendEvent } from '@/stores/analytics'
import { getHubIds } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { SpaceData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { HubsPageProps } from './HomePage'

export default function HubsContent({
  hubsChatCount = {},
  isIntegrateChatButtonOnTop,
}: Pick<HubsPageProps, 'hubsChatCount' | 'isIntegrateChatButtonOnTop'>) {
  const isInIframe = useIsInIframe()
  const hubIds = getHubIds()

  const hubQueries = getSpaceQuery.useQueries(hubIds)
  const hubs = hubQueries.map(({ data: hub }) => hub)

  return (
    <div className='flex flex-col'>
      {!isInIframe && (
        <ChatSpecialButtons
          isIntegrateChatButtonOnTop={!!isIntegrateChatButtonOnTop}
        />
      )}

      <div className='flex flex-col overflow-auto'>
        {hubs.map((hub) => {
          if (!hub) return null
          const hubId = hub.id
          return (
            <ChatPreviewContainer
              hub={hub}
              chatCount={hubsChatCount[hubId]}
              key={hubId}
            />
          )
        })}
      </div>
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

  const path = getAliasFromHubId(hub.id) || hub.id
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
      title={content?.name}
      description={content?.about}
      withFocusedStyle={isFocused}
    />
  )
}
