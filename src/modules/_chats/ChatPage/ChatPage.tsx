import ChatRoom from '@/components/chats/ChatRoom'
import useLastReadMessageId from '@/hooks/useLastReadMessageId'
import { getPostQuery } from '@/services/api/query'
import { useCommentIdsByPostId } from '@/services/subsocial/commentIds'
import { getSpaceId } from '@/utils/env/client'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { useEffect } from 'react'
import ChatNavbarExtension from './ChatNavbarExtension'

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
    <>
      <ChatNavbarExtension
        image={content?.image ? getIpfsContentUrl(content.image) : ''}
        messageCount={data?.length ?? 0}
        topic={content?.title ?? ''}
      />
      <ChatRoom
        spaceId={getSpaceId()}
        postId={postId}
        asContainer
        className='flex-1 overflow-hidden'
      />
    </>
  )
}
