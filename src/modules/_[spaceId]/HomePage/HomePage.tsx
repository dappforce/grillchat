import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import ChatPreview from '@/components/chats/ChatPreview'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getLinkedPostIdsForSpaceId } from '@/constants/chat-room'
import useIsInIframe from '@/hooks/useIsInIframe'
import { getPostQuery } from '@/services/api/query'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { PostData } from '@subsocial/api/types'
import { matchSorter } from 'match-sorter'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import HomePageNavbar from './HomePageNavbar'
import useSortByConfig from './hooks/useSortByConfig'
import useSortedPostIdsByLatestMessage from './hooks/useSortByLatestMessage'

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
  const { data } = getPostIdsBySpaceIdQuery.useQuery(spaceId)
  const allPostIds = useMemo(() => {
    return [...(data?.postIds ?? []), ...getLinkedPostIdsForSpaceId(spaceId)]
  }, [data, spaceId])

  const sortedIds = useSortedPostIdsByLatestMessage(allPostIds)
  const order = useSortByConfig(sortedIds)

  const [search, setSearch] = useState('')
  const postsQuery = getPostQuery.useQueries(order)

  const searchResults = useMemo(() => {
    const postsData = postsQuery.map(({ data: post }) => post)
    let searchResults = postsData as PostData[]

    const multipleSpacesRegex = / {2}+/g
    const processedSearch = search.replace(multipleSpacesRegex, ' ').trim()

    if (processedSearch) {
      searchResults = matchSorter(postsData, processedSearch, {
        keys: ['content.title'],
      }) as PostData[]
    }

    return searchResults
  }, [search, postsQuery])

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
        {searchResults.map((post, idx) => {
          if (!post) return null
          return (
            <ChatPreviewContainer
              isFocused={idx === focusedElementIndex}
              post={post}
              key={post.id}
            />
          )
        })}
      </div>
    </DefaultLayout>
  )
}

function ChatPreviewContainer({
  post,
  isFocused,
}: {
  post: PostData
  isFocused?: boolean
}) {
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const content = post?.content

  const linkTo = getChatPageLink(
    router,
    createSlug(post.id, { title: content?.title })
  )

  useEffect(() => {
    if (!isFocused) return
    const listener = (e: KeyboardEvent) => {
      const method = isInIframe ? 'replace' : 'push'
      if (e.key === 'Enter') {
        router[method](linkTo)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [linkTo, isFocused, router, isInIframe])

  const onChatClick = () => {
    sendEvent(`click on chat`, {
      title: content?.title ?? '',
      chatId: post.id,
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
      postId={post.id}
      withUnreadCount
      withFocusedStyle={isFocused}
    />
  )
}
