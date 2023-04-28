import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import Button from '@/components/Button'
import ChatPreview from '@/components/chats/ChatPreview'
import Input from '@/components/inputs/Input'
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
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { BsXCircleFill } from 'react-icons/bs'
import { HiMagnifyingGlass } from 'react-icons/hi2'
import useSortedPostIdsByLatestMessage from './hooks/useSortByLatestMessage'
import useSortByUrlQuery from './hooks/useSortByUrlQuery'

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
  const order = useSortByUrlQuery(sortedIds)

  const [search, setSearch] = useState('')

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
            />
          )
        },
      }}
    >
      {!isInIframe && <WelcomeModal />}
      <div className='flex flex-col overflow-auto'>
        {!isInIframe && specialButtons}
        {order.map((postId) => (
          <ChatPreviewContainer postId={postId} key={postId} />
        ))}
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
}
function HomePageNavbar({
  auth,
  colorModeToggler,
  logo,
  search,
  setSearch,
}: HomePageNavbarProps) {
  const [openSearch, setOpenSearch] = useState(false)

  return (
    <div className='relative'>
      <div
        className={cx(
          'absolute top-1/2 left-0 z-10 w-full -translate-y-1/2 transition-opacity',
          !openSearch && 'pointer-events-none opacity-0'
        )}
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={(className) => (
            <HiMagnifyingGlass
              className={cx(className, 'z-10 ml-1 text-xl text-text-muted')}
            />
          )}
          rightElement={(className) => (
            <BsXCircleFill
              className={cx(className, 'z-10 mr-1 text-lg text-text-muted')}
            />
          )}
          size='sm'
          pill
          placeholder='Search rooms'
          variant='fill'
          className='bg-background pl-10'
        />
      </div>
      <div
        className={cx(
          'relative z-0 flex items-center justify-between transition-opacity',
          openSearch && 'opacity-0'
        )}
      >
        {logo}
        <div className='flex items-center gap-2'>
          {colorModeToggler}
          <Button
            size='circle'
            variant='transparent'
            onClick={() => setOpenSearch(true)}
          >
            <HiMagnifyingGlass />
          </Button>
          <div className='ml-1.5'>{auth}</div>
        </div>
      </div>
    </div>
  )
}

function ChatPreviewContainer({ postId }: { postId: string }) {
  const { data } = getPostQuery.useQuery(postId)
  const sendEvent = useSendEvent()
  const isInIframe = useIsInIframe()
  const router = useRouter()

  const content = data?.content

  const onChatClick = () => {
    sendEvent(`click on chat`, {
      title: content?.title ?? '',
      chatId: postId,
    })
  }

  return (
    <ChatPreview
      onClick={onChatClick}
      key={postId}
      asContainer
      asLink={{
        replace: isInIframe,
        href: getChatPageLink(
          router,
          createSlug(postId, { title: content?.title })
        ),
      }}
      image={content?.image ? getIpfsContentUrl(content.image) : ''}
      title={content?.title ?? ''}
      description={content?.body ?? ''}
      postId={postId}
      withUnreadCount
    />
  )
}
