import ChatPreview from '@/components/chats/ChatPreview'
import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import { getAliasFromSpaceId } from '@/constants/chat-room'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { useSendEvent } from '@/stores/analytics'
import { getSpaceIds } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { SpaceData } from '@subsocial/api/types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HubsPageProps = {
  isIntegrateChatButtonOnTop: boolean
  hubsChatCount: { [id: string]: number }
}

const searchKeys = ['content.title']
export default function HubsPage({
  isIntegrateChatButtonOnTop,
  hubsChatCount = {},
}: HubsPageProps) {
  const isInIframe = useIsInIframe()
  const hubIds = getSpaceIds()
  const hubQueries = getSpaceBySpaceIdQuery.useQueries(hubIds)
  const hubs = useMemo(
    () => hubQueries.map(({ data: hub }) => hub),
    [hubQueries]
  )

  const { search, setSearch, focusController, searchResults } = useSearch(
    hubs,
    searchKeys
  )

  return (
    <DefaultLayout
      navbarProps={{
        customContent: (logo, auth, colorModeToggler) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logo}
                  <div className='flex items-center gap-2'>
                    {searchButton}
                    {colorModeToggler}
                    <div className='ml-1.5'>{auth}</div>
                  </div>
                </div>
              )}
              searchProps={{
                search,
                setSearch,
                ...focusController,
              }}
            />
          )
        },
      }}
    >
      {!isInIframe && <WelcomeModal />}
      <div className='flex flex-col overflow-auto'>
        {!isInIframe && !search && (
          <ChatSpecialButtons
            isIntegrateChatButtonOnTop={isIntegrateChatButtonOnTop}
          />
        )}
        {searchResults.map((hub, idx) => {
          if (!hub) return null
          return (
            <ChatPreviewContainer
              isFocused={idx === focusController.focusedElementIndex}
              hub={hub}
              chatCount={hubsChatCount[hub.id]}
              key={hub.id}
            />
          )
        })}
      </div>
    </DefaultLayout>
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
      title: hub.content?.name ?? '',
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
      image={getIpfsContentUrl(hub.content?.image ?? '')}
      title={hub.content?.name ?? ''}
      description={hub.content?.about ?? ''}
      withFocusedStyle={isFocused}
    />
  )
}
