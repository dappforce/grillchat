import { VideoCard } from '@/components/cards'
import useDiscoverVideosBySpace from '@/hooks/useDiscoverVideosBySoaceId'
export default function HomePage() {
  //const {posts, isPostsLoading, isPostsError} = useDiscoverFromApp()

  const { posts } = useDiscoverVideosBySpace()
  const filteredPosts = posts?.posts?.filter(
    (post) => post.hasOwnProperty('image') && post.image !== null
  )
  console.log('all posts data ', filteredPosts)
  return (
    <div className='flex flex-wrap gap-4'>
      {filteredPosts?.map((note, i) => (
        <VideoCard
          key={i}
          video={note}
          title={note?.title}
          createdAt={note?.createdAtTime}
          cover={note?.image}
        />
      ))}
    </div>
  )
}
