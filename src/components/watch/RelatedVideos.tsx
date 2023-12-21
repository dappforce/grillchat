//@ts-nocheck
import useDiscoverVideosBySpace from '@/hooks/useDiscoverVideosBySoaceId'
import RelatedVideoCrad from '../cards/RelatedVideoCrad'

export default function RelatedVideos() {
  const { posts, isPostsLoading, isPostsError } = useDiscoverVideosBySpace()
  return (
    <div className='hidden w-[27%] flex-col gap-3 xl:flex'>
      {posts?.posts?.map((note, i) => (
        <RelatedVideoCrad
          key={i}
          video={note}
          title={note?.title}
          cover={note?.experimental?.videoCover}
          channel={note?.character}
          channelId={note?.characterId}
          noteId={note.noteId}
          createdAt={note?.createdAtTime}
          hubId={note?.space?.id}
          videoId={note?.id}
          creatorAddress={note?.createdByAccount?.address}
        />
      ))}
    </div>
  )
}
