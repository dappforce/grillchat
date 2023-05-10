import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import ChatPreview from '@/components/chats/ChatPreview'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import { getAliasFromSpaceId } from '@/constants/chat-room'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getSpaceIds } from '@/utils/env/client'
import { removeDoubleSpaces } from '@/utils/strings'
import { SpaceData } from '@subsocial/api/types'
import { matchSorter } from 'match-sorter'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HubsPageProps = {
  isIntegrateChatButtonOnTop: boolean
  hubsChatCount: { [id: string]: number }
}
export default function HubsPage({
  isIntegrateChatButtonOnTop,
  hubsChatCount = {},
}: HubsPageProps) {
  const isInIframe = useIsInIframe()
  const hubIds = getSpaceIds()
  const hubQueries = getSpaceBySpaceIdQuery.useQueries(hubIds)

  const [search, setSearch] = useState('')
  const searchResults = useMemo(() => {
    const hubs = hubQueries.map(({ data: hub }) => hub)
    let searchResults = hubs
    const processedSearch = removeDoubleSpaces(search)

    if (processedSearch) {
      searchResults = matchSorter(hubs, processedSearch, {
        keys: ['content.title'],
      })
    }

    return searchResults
  }, [search, hubQueries])

  const [focusedElementIndex, setFocusedElementIndex] = useState(-1)
  useEffect(() => {
    setFocusedElementIndex(-1)
  }, [search])
  const removeFocusedElement = () => {
    setFocusedElementIndex(-1)
  }
  const onDownClick = () => {
    setFocusedElementIndex((prev) =>
      Math.min(prev + 1, searchResults.length - 1)
    )
  }
  const onUpClick = () => {
    setFocusedElementIndex((prev) => Math.max(prev - 1, 0))
  }

  const sendEvent = useSendEvent()

  const integrateChatButton = (
    <ChatPreview
      key='integrate-chat'
      isPinned
      asLink={{ href: '/integrate-chat' }}
      asContainer
      onClick={() => sendEvent('click integrate_chat_button')}
      image={
        <div className='h-full w-full bg-background-primary p-3 text-text-on-primary'>
          <Image src={IntegrateIcon} alt='integrate chat' />
        </div>
      }
      className={cx(
        'bg-background-light md:rounded-none md:bg-background-light/50',
        isIntegrateChatButtonOnTop ? '' : 'md:rounded-b-3xl'
      )}
      withBorderBottom={isIntegrateChatButtonOnTop}
      title='Integrate chat into an existing app'
      description='Let your users communicate using blockchain'
    />
  )

  const launchCommunityButton = (
    <ChatPreview
      key='launch-community'
      isPinned
      asLink={{ href: '/launch-community' }}
      asContainer
      onClick={() => sendEvent('click launch_community_button')}
      image={
        <div className='h-full w-full bg-background-primary p-4 text-text-on-primary'>
          <Image src={AddIcon} alt='launch community' />
        </div>
      }
      className={cx(
        'bg-background-light md:rounded-none md:bg-background-light/50',
        isIntegrateChatButtonOnTop ? 'md:rounded-b-3xl' : ''
      )}
      withBorderBottom={!isIntegrateChatButtonOnTop}
      title='Launch your community'
      description='Create your own discussion groups'
    />
  )

  const specialButtons = isIntegrateChatButtonOnTop
    ? [integrateChatButton, launchCommunityButton]
    : [launchCommunityButton, integrateChatButton]

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
                removeFocusedElement,
                onUpClick,
                onDownClick,
              }}
            />
          )
        },
      }}
    >
      {!isInIframe && <WelcomeModal />}
      <div className='flex flex-col overflow-auto'>
        {!isInIframe && !search && specialButtons}
        {searchResults.map((hub, idx) => {
          if (!hub) return null
          return (
            <ChatPreviewContainer
              isFocused={idx === focusedElementIndex}
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
      image={hub.content?.image ?? ''}
      title={hub.content?.name ?? ''}
      description={hub.content?.about ?? ''}
      withFocusedStyle={isFocused}
    />
  )
}
