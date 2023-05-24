import ChatPreview from '@/components/chats/ChatPreview'
import ChatSpecialButtons from '@/components/chats/ChatSpecialButtons'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import Tabs, { TabsProps } from '@/components/Tabs'
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
import { useHotkeys } from 'react-hotkeys-hook'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HubsPageProps = {
  isIntegrateChatButtonOnTop: boolean
  hubsChatCount: { [id: string]: number }
}

type CommonContentProps = {
  getSearchResults: ReturnType<typeof useSearch>['getSearchResults']
}

export default function HubsPage(props: HubsPageProps) {
  const isInIframe = useIsInIframe()
  const { search, setSearch, getSearchResults, focusController } = useSearch()

  const renderHubsContent = (children: JSX.Element) => {
    return (
      <HubsContentWrapper
        search={search}
        isIntegrateChatButtonOnTop={props.isIntegrateChatButtonOnTop}
      >
        {children}
      </HubsContentWrapper>
    )
  }

  const tabs: TabsProps['tabs'] = [
    {
      id: 'my-chats',
      text: 'My Chats',
      content: renderHubsContent(<span>asdfasdf</span>),
    },
    {
      id: 'hubs',
      text: 'Hubs',
      content: renderHubsContent(
        <HubsContent
          getSearchResults={getSearchResults}
          hubsChatCount={props.hubsChatCount}
        />
      ),
    },
  ]

  return (
    <DefaultLayout
      navbarProps={{
        customContent: ({ logoLink, authComponent, colorModeToggler }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-2'>
                    {searchButton}
                    {colorModeToggler}
                    <div className='ml-1.5'>{authComponent}</div>
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
      <Tabs
        className='border-b border-border-gray bg-background-light px-4 md:bg-background-light/50'
        panelClassName='mt-0 px-0'
        asContainer
        tabs={tabs}
      />
      {!isInIframe && <WelcomeModal />}
    </DefaultLayout>
  )
}

function HubsContentWrapper({
  isIntegrateChatButtonOnTop,
  children,
  search,
}: {
  isIntegrateChatButtonOnTop: boolean
  children: JSX.Element
  search: string
}) {
  const isInIframe = useIsInIframe()
  return (
    <div className='flex flex-col'>
      {!isInIframe && !search && (
        <ChatSpecialButtons
          isIntegrateChatButtonOnTop={isIntegrateChatButtonOnTop}
        />
      )}
      {children}
    </div>
  )
}

function HubsContent({
  hubsChatCount = {},
  getSearchResults,
}: CommonContentProps & Pick<HubsPageProps, 'hubsChatCount'>) {
  const hubIds = getSpaceIds()

  const hubQueries = getSpaceBySpaceIdQuery.useQueries(hubIds)
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
