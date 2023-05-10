import NoResultImage from '@/assets/graphics/no-result.png'
import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import Button from '@/components/Button'
import ChatPreview from '@/components/chats/ChatPreview'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getLinkedChatIdsForSpaceId } from '@/constants/chat-room'
import { SUGGEST_NEW_CHAT_ROOM_LINK } from '@/constants/links'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getPostQuery } from '@/services/api/query'
import { getChatIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { removeDoubleSpaces } from '@/utils/strings'
import { PostData } from '@subsocial/api/types'
import { matchSorter } from 'match-sorter'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { HiArrowUpRight } from 'react-icons/hi2'
import HomePageNavbar from './HomePageNavbar'
import useSortByConfig from './hooks/useSortByConfig'
import useSortedChatIdsByLatestMessage from './hooks/useSortByLatestMessage'

const WelcomeModal = dynamic(() => import('./WelcomeModal'), { ssr: false })

export type HomePageProps = {
  isIntegrateChatButtonOnTop: boolean
  spaceId: string
}
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

  const [search, setSearch] = useState('')
  const chatQueries = getPostQuery.useQueries(order)

  const searchResults = useMemo(() => {
    const chats = chatQueries.map(({ data: chat }) => chat)
    let searchResults = chats as PostData[]

    const processedSearch = removeDoubleSpaces(search)

    if (processedSearch) {
      searchResults = matchSorter(chats, processedSearch, {
        keys: ['content.title'],
      }) as PostData[]
    }

    return searchResults
  }, [search, chatQueries])

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
            <HomePageNavbar
              auth={auth}
              colorModeToggler={colorModeToggler}
              logo={logo}
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
        {searchResults.length === 0 && <NoSearchResultScreen />}
        {searchResults.map((chat, idx) => {
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

function NoSearchResultScreen() {
  return (
    <Container
      as='div'
      className='mt-20 flex !max-w-lg flex-col items-center justify-center gap-4 text-center'
    >
      <Image src={NoResultImage} className='h-80 w-80' alt='' />
      <span className='text-3xl font-bold'>😳 No results</span>
      <p className='text-text-muted'>
        Sorry, no chats were found with that name. However, our support team is
        ready to help! Ask them to create a personalized chat tailored to your
        needs.
      </p>
      <Button
        className='w-full'
        size='lg'
        href={SUGGEST_NEW_CHAT_ROOM_LINK}
        target='_blank'
        rel='noopener noreferrer'
      >
        Contact Support <HiArrowUpRight className='inline' />
      </Button>
    </Container>
  )
}
