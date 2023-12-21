//import { useGetVideoComments } from '@/hooks';

type commentsProps = {
  comments?: any
  profileId?: any
  videoId?: any
  loading?: any
  hubId?: any
  chatId?: any
  commentsCount?: any
}
export default function Comments({
  comments,
  videoId,
  profileId,
  hubId,
  chatId,
  commentsCount,
}: commentsProps) {
  return (
    <div>
      <h1 className='my-3'>Comments {commentsCount}</h1>
    </div>
  )
}
