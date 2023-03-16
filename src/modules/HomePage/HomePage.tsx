import AddIcon from '@/assets/icons/add.png'
import IntegrateIcon from '@/assets/icons/integrate.png'
import ChatPreview from '@/components/chats/ChatPreview'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getPostQuery } from '@/services/api/query'
import { getPostIdsBySpaceIdQuery } from '@/services/subsocial/posts'
import { useSendEvent } from '@/stores/analytics'
import { getSpaceId } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { createPostSlug } from '@subsocial/utils/slugify'
import dynamic from 'next/dynamic'

const WelcomeModal = dynamic(() => import('./WelcomeModal'), { ssr: false })

export default function HomePage() {
  const { data } = getPostIdsBySpaceIdQuery.useQuery(getSpaceId())

  return (
    <DefaultLayout>
      <WelcomeModal />
      <div className='flex flex-col'>
        <ChatPreview
          isPinned
          asLink={{ href: '/' }}
          asContainer
          className='bg-background-light md:bg-transparent'
          title='Integrate chat into an existing app'
          description='Let your users communicate using blockchain'
          image={IntegrateIcon}
        />
        <ChatPreview
          isPinned
          asLink={{ href: '/' }}
          asContainer
          className='bg-background-light md:bg-transparent'
          title='Launch your community'
          description='Create your own discussion groups'
          image={AddIcon}
        />
        {(data?.postIds ?? []).map((postId) => (
          <ChatPreviewContainer postId={postId} key={postId} />
        ))}
      </div>
    </DefaultLayout>
  )
}

function ChatPreviewContainer({ postId }: { postId: string }) {
  const { data } = getPostQuery.useQuery(postId)
  const sendEvent = useSendEvent()

  const content = data?.content

  const onChatClick = () =>
    sendEvent(`click on chat ${content?.title}`, {
      chatId: postId,
    })

  return (
    <ChatPreview
      onClick={onChatClick}
      key={postId}
      asContainer
      asLink={{
        href: {
          pathname: '/chats/[topic]',
          query: {
            topic: createPostSlug(postId, { title: content?.title }),
          },
        },
      }}
      image={content?.image ? getIpfsContentUrl(content.image) : ''}
      title={content?.title ?? ''}
      description={content?.body ?? ''}
      postId={postId}
      withUnreadCount
    />
  )
}
