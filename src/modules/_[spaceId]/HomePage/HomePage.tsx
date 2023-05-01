import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import Button from '@/components/Button'
import ChatPreview from '@/components/chats/ChatPreview'
import Input from '@/components/inputs/Input'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getLinkedPostIdsForSpaceId } from '@/constants/chat-room'
import useIsInIframe from '@/hooks/useIsInIframe'
import useWrapInRef from '@/hooks/useWrapInRef'
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
import { useEffect, useMemo, useRef, useState } from 'react'
import { BsXCircleFill } from 'react-icons/bs'
import { HiMagnifyingGlass } from 'react-icons/hi2'
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

  let searchResults: PostData[]
  if (search) {
    searchResults = matchSorter(
      postsQuery.map(({ data: post }) => post),
      search,
      {
        keys: ['content.title'],
      }
    ) as PostData[]
  } else {
    searchResults = postsQuery.map(({ data: post }) => post) as PostData[]
  }

  const [focusedElementIndex, setFocusedElementIndex] = useState(-1)
  useEffect(() => {
    setFocusedElementIndex(-1)
  }, [search])
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
              search={search}
              setSearch={setSearch}
              auth={auth}
              colorModeToggler={colorModeToggler}
              logo={logo}
              setFocusedElementIndex={setFocusedElementIndex}
              onUpClick={onUpClick}
              onDownClick={onDownClick}
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

type HomePageNavbarProps = {
  logo: JSX.Element
  auth: JSX.Element
  colorModeToggler: JSX.Element
  search: string
  setSearch: (search: string) => void
  setFocusedElementIndex: React.Dispatch<React.SetStateAction<number>>
  onUpClick: () => void
  onDownClick: () => void
}
function HomePageNavbar({
  auth,
  colorModeToggler,
  logo,
  search,
  setSearch,
  onDownClick,
  onUpClick,
}: HomePageNavbarProps) {
  const [openSearch, setOpenSearch] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const clearOrCloseSearch = useWrapInRef(() => {
    if (search) {
      setSearch('')
      searchRef.current?.focus()
    } else {
      setOpenSearch(false)
    }
  })

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearOrCloseSearch.current()
      }
    }
    window.addEventListener('keydown', keyListener)
    return () => window.removeEventListener('keydown', keyListener)
  }, [clearOrCloseSearch])

  useEffect(() => {
    if (openSearch) return
    const openSearchHotKeyListener = (e: KeyboardEvent) => {
      if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault()
        setOpenSearch(true)
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', openSearchHotKeyListener)
    return () => window.removeEventListener('keydown', openSearchHotKeyListener)
  }, [openSearch])

  const onUpClickRef = useWrapInRef(onUpClick)
  const onDownClickRef = useWrapInRef(onDownClick)
  useEffect(() => {
    if (!openSearch) return
    const arrowListener = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        onDownClickRef.current()
      } else if (e.key === 'ArrowUp') {
        onUpClickRef.current()
      }
    }
    window.addEventListener('keydown', arrowListener)
    return () => window.removeEventListener('keydown', arrowListener)
  }, [openSearch, onUpClickRef, onDownClickRef])

  return (
    <div className='relative'>
      <div
        className={cx(
          'absolute top-1/2 left-0 z-10 w-full -translate-y-1/2 transition-opacity',
          !openSearch && 'pointer-events-none opacity-0'
        )}
      >
        <Input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={(className) => (
            <HiMagnifyingGlass
              className={cx(className, 'z-10 ml-1 text-text-muted')}
            />
          )}
          rightElement={(className) => (
            <Button
              variant='transparent'
              size='noPadding'
              className={cx(
                className,
                'z-10 mr-1 cursor-pointer text-text-muted'
              )}
              onClick={clearOrCloseSearch.current}
            >
              <BsXCircleFill />
            </Button>
          )}
          size='sm'
          pill
          placeholder='Search rooms'
          variant='fill'
          className='bg-background pl-9'
        />
      </div>
      <div
        className={cx(
          'relative z-0 flex items-center justify-between transition-opacity',
          openSearch && 'opacity-0'
        )}
      >
        {logo}
        <div className='flex items-center gap-2 text-text-muted dark:text-text'>
          <Button
            size='circle'
            variant='transparent'
            onClick={() => {
              setOpenSearch(true)
              searchRef.current?.focus()
            }}
          >
            <HiMagnifyingGlass />
          </Button>
          {colorModeToggler}
          <div className='ml-1.5'>{auth}</div>
        </div>
      </div>
    </div>
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

  const routerRef = useWrapInRef(router)
  useEffect(() => {
    if (!isFocused) return
    const listener = (e: KeyboardEvent) => {
      const method = isInIframe ? 'replace' : 'push'
      if (e.key === 'Enter') {
        routerRef.current[method](linkTo)
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [linkTo, isFocused, routerRef, isInIframe])

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
