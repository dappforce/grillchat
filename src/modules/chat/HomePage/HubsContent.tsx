import ChatPreview from '@/components/chats/ChatPreview'
import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import { getAliasFromHubId, getPinnedHubIds } from '@/constants/config'
import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { useSendEvent } from '@/stores/analytics'
import { SpaceData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { HomePageProps } from './HomePage'

export default function HubsContent({
  hubsChatCount = {},
}: Pick<HomePageProps, 'hubsChatCount'>) {
  const isInIframe = useIsInIframe()
  const hubIds = env.NEXT_PUBLIC_SPACE_IDS

  const sortedHubIds = useMemo(() => {
    return Array.from(new Set([...getPinnedHubIds(), ...hubIds]))
  }, [hubIds])

  const hubQueries = getSpaceQuery.useQueries(sortedHubIds)
  const hubs = hubQueries.map(({ data: hub }) => hub)

  return (
    <div className='flex flex-col'>
      {!isInIframe && <ChatSpecialButtons />}

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
    sendEvent(`open_hub`, {
      title: content?.name ?? '',
      hubId: hub.id,
    })
  }

  return (
    <ChatPreview
      rounding='2xl'
      onClick={onChatClick}
      asContainer
      asLink={{
        replace: isInIframe,
        href: linkTo,
      }}
      additionalDesc={chatCount ? `${chatCount} chats` : undefined}
      isPinned={getPinnedHubIds().includes(hub.id)}
      image={content?.image}
      title={content?.name}
      description={content?.about}
      withFocusedStyle={isFocused}
    />
  )
}
