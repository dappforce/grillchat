import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import ChatPreview from '@/components/chats/ChatPreview'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getLinkedChatIdsForSpaceId } from '@/constants/chat-room'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import { getPostQuery } from '@/services/api/query'
import { getChatIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { PostData } from '@subsocial/api/types'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import HomePageNavbar from './HomePageNavbar'
import useSortByConfig from './hooks/useSortByConfig'
import useSortedChatIdsByLatestMessage from './hooks/useSortByLatestMessage'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HomePageProps = {
  isIntegrateChatButtonOnTop: boolean
  spaceId: string
}
const searchKeys = ['content.title']
export default function HomePage({
  isIntegrateChatButtonOnTop,
  spaceId,
}: HomePageProps) {
  const isInIframe = useIsInIframe()
  const { data } = getChatIdsBySpaceIdQuery.useQuery(spaceId)
  const allChatIds = useMemo(() => {
    return [...(data?.chatIds ?? []), ...getLinkedChatIdsForSpaceId(spaceId)]
  }, [data, spaceId])

  const sortedIds = useSortedChatIdsByLatestMessage(allChatIds)
  const order = useSortByConfig(sortedIds)

  const chatQueries = getPostQuery.useQueries(order)
  const chats = useMemo(
    () => chatQueries.map(({ data }) => data),
    [chatQueries]
  )

  const { search, searchResults, setSearch, focusController } = useSearch(
    chats,
    searchKeys
  )

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
            <HomePageNavbar
              chatsCount={allChatIds.length}
              logo={logo}
              auth={auth}
              colorModeToggler={colorModeToggler}
              spaceId={spaceId}
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
        {!isInIframe && !search && specialButtons}
        {searchResults.map((chat, idx) => {
          if (!chat) return null
          return (
            <ChatPreviewContainer
              isFocused={idx === focusController.focusedElementIndex}
              chat={chat}
              key={chat.id}
            />
          )
        })}
      </div>
    </DefaultLayout>
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
