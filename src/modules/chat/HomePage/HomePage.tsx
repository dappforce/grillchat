import NoResultImage from '@/assets/graphics/no-result.png'
import Button from '@/components/Button'
import ChatPreview from '@/components/chats/ChatPreview'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getLinkedChatIdsForSpaceId } from '@/constants/chat-room'
import { getSuggestNewChatRoomLink } from '@/constants/links'
import useIsInIframe from '@/hooks/useIsInIframe'
import useSearch from '@/hooks/useSearch'
import { getPostQuery } from '@/services/api/query'
import { getChatIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { PostData } from '@subsocial/api/types'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { HiArrowUpRight } from 'react-icons/hi2'
import HomePageNavbar from './HomePageNavbar'
import useSortByConfig from './hooks/useSortByConfig'
import useSortedChatIdsByLatestMessage from './hooks/useSortByLatestMessage'

const WelcomeModal = dynamic(() => import('@/components/modals/WelcomeModal'), {
  ssr: false,
})

export type HomePageProps = {
  spaceId: string
}
const searchKeys = ['content.title']
export default function HomePage({ spaceId }: HomePageProps) {
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

  return (
    <DefaultLayout
      navbarProps={{
        backButtonProps: {
          defaultBackLink: '/hubs',
          forceUseDefaultBackLink: true,
        },
        customContent: ({
          backButton,
          logoLink,
          authComponent,
          colorModeToggler,
        }) => {
          return (
            <HomePageNavbar
              chatsCount={allChatIds.length}
              auth={authComponent}
              colorModeToggler={colorModeToggler}
              backButton={backButton}
              logo={logoLink}
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
      <div className='flex flex-col'>
        {searchResults.length === 0 && (
          <NoSearchResultScreen search={search} hubId={spaceId} />
        )}
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

function NoSearchResultScreen({
  search,
  hubId,
}: {
  search: string
  hubId: string
}) {
  return (
    <Container
      as='div'
      className='mt-20 flex !max-w-lg flex-col items-center justify-center gap-4 text-center'
    >
      <Image
        src={NoResultImage}
        className='h-80 w-80'
        alt=''
        role='presentation'
      />
      <span className='text-3xl font-bold'>😳 No results</span>
      <p className='text-text-muted'>
        Sorry, no chats were found with that name. However, our support team is
        ready to help! Ask them to create a personalized chat tailored to your
        needs.
      </p>
      <Button
        className='w-full'
        size='lg'
        href={getSuggestNewChatRoomLink({ chatName: search, hubId })}
        target='_blank'
        rel='noopener noreferrer'
      >
        Contact Support <HiArrowUpRight className='inline' />
      </Button>
    </Container>
  )
}
