import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getSpaceId } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image, { ImageProps } from 'next/image'
import { useEffect } from 'react'
import { HiOutlineChevronLeft } from 'react-icons/hi2'

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
          <div className='flex justify-between'>
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
      <ChatRoom
        spaceId={getSpaceId()}
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
      <div className='flex items-center gap-2'>
        <Image
          className='h-9 w-9 justify-self-end'
          width={36}
          height={36}
          src={image}
          alt={topic ?? 'chat topic'}
        />
        <div className='flex flex-col'>
          <span className='font-medium'>{topic ?? 'Topic'}</span>
          <span className='text-xs text-text-muted'>
            {messageCount} messages
          </span>
        </div>
      </div>
    </div>
  )
}
