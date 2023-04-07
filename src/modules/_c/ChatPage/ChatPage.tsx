import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image, { ImageProps } from 'next/image'
import { useEffect } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import ChatPageNavbarExtension from './ChatPageNavbarExtension'

export default function ChatPage({ postId }: { postId: string }) {
  const { data: post } = getPostQuery.useQuery(postId)
  const { data } = useCommentIdsByPostId(postId, { subscribe: true })

  const { setLastReadMessageId } = useLastReadMessageId(postId)

  useEffect(() => {
    const lastId = data?.[data.length - 1]
    if (!lastId) return
    setLastReadMessageId(lastId)
  }, [setLastReadMessageId, data])

  const content = post?.content

  return (
    <DefaultLayout
      navbarProps={{
        customContent: (authComponent) => (
          <div className='flex items-center justify-between gap-4'>
            <NavbarChatInfo
              image={content?.image ? getIpfsContentUrl(content.image) : ''}
              messageCount={data?.length ?? 0}
              topic={content?.title ?? ''}
            />
            {authComponent}
          </div>
        ),
      }}
    >
      <ChatPageNavbarExtension />
      <ChatRoom
        postId={postId}
        asContainer
        className='flex-1 overflow-hidden'
      />
    </DefaultLayout>
  )
}

function NavbarChatInfo({
  image,
  messageCount,
  topic,
}: {
  image: ImageProps['src']
  messageCount: number
  topic: string
}) {
  return (
    <div className='flex items-center'>
      <div className='mr-2 flex w-9 items-center justify-center'>
        <Button size='circle' href='/' variant='transparent'>
          <HiOutlineChevronLeft />
        </Button>
      </div>
      <div className='flex items-center gap-2 overflow-hidden'>
        <Image
          className='h-9 w-9 justify-self-end rounded-full bg-background-lightest'
          width={36}
          height={36}
          src={image}
          alt={topic ?? 'chat topic'}
        />
        <div className='flex flex-col overflow-hidden'>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
            {topic ?? 'Topic'}
          </span>
          <span className='text-xs text-text-muted'>
            {messageCount} messages
          </span>
        </div>
      </div>
    </div>
  )
}
