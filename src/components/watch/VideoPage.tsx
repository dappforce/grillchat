import { IPFS_GATEWAY2 } from '@/assets/constant'
//import { GET_VIDEO_BY_ID } from '@/graphql/fragments/getVideoById'
import { Player } from '@livepeer/react'
import Image from 'next/image'
//import RelatedVideos from '../relatedVids/RelatedVideos'
import ChatRoom from '../chats/ChatRoom'
import FullVideoStats from './FullVideoStats'
type videoPageProps = {
  videoUri?: any
  videoTitle?: any
  videoCover?: any
  channelId?: any
  channelInfo?: any
  createdAt?: any
  videoId?: any
  totalTips?: any
  Stats?: any
  vidStats?: any
  loading?: any
  hubId?: any
  chatId?: any
  commentsCount?: any
  creatorId?: any
}
export default function VideoPage({
  vidStats,
  videoCover,
  videoId,
  videoTitle,
  videoUri,
  channelId,
  channelInfo,
  totalTips,
  loading,
  createdAt,
  hubId,
  chatId,
  commentsCount,
  creatorId,
}: videoPageProps) {
  const fakeComments = 0

  //FECH VIDEO  COMMENTS
  // const COMMENTS_BASE_URL = `https://indexer.crossbell.io/v1/notes?limit=20&toCharacterId=${channelId}&toNoteId=${videoId}&includeDeleted=false&includeEmptyMetadata=false&includeCharacter=true&includeHeadCharacter=false&includeHeadNote=false&includeNestedNotes=true`;

  /*const fetchvideoComments = async () => {
        return axios.get(COMMENTS_BASE_URL);
      };*/

  /*  const {
        data: comments,
        isLoading: isCommentsLoading,
        isError: isCommentsError,
        error: commentsError,
      } = useFetch(["comments-data"], fetchvideoComments);
      console.log("video comments", comments);*/

  /*  const { data: profileStats } = useCharacterFollowStats(channelId);
  console.log("user stats data", profileStats);*/
  const PosterImage = () => {
    return (
      <Image
        src={`${IPFS_GATEWAY2}${videoCover}`}
        layout='fill'
        objectFit='cover'
        priority
        alt='cover'
      />
    )
  }

  return (
    <div>
      <div className='flex gap-2'>
        <div className='mx-auto w-[95%] rounded-3xl xl:mx-1  xl:w-[73%] '>
          <Player
            playbackId={`${IPFS_GATEWAY2}${videoUri}`}
            poster={<PosterImage />}
            showPipButton
            objectFit='cover'
            priority
          />
          <div className='mt-4'>
            <h1 className=' text-2xl'>{videoTitle}</h1>

            <div>
              <FullVideoStats
                stats={vidStats}
                tips={totalTips}
                videId={videoId}
                createdAt={createdAt}
                likes={20}
                isLiked={true}
                note={{ characterId: channelId, noteId: videoId }}
                creatorId={creatorId}
                chatId={chatId}
              />
            </div>
            <div>
              {/*}
          <ChannelInfo  channel={channelInfo} />
*/}
            </div>

            <div>
              <h1 className='my-3'>Comments {commentsCount}</h1>
              <ChatRoom
                hubId={hubId}
                chatId={chatId}
                asContainer
                className='flex-1 overflow-hidden'
                //customAction={customAction}
              />
            </div>
          </div>
        </div>
        {/*}
    <RelatedVideos   />
*/}
        <p>Related videos</p>
      </div>
    </div>
  )
}
