import { useState } from 'react'
//import { useGetVideoComments } from '@/hooks';
import Image from 'next/image'
import CommentCard from '../cards/CommentCard'

type commentsProps = {
  comments?: any
  profileId?: any
  videoId?: any
  loading?: any
}
export default function Comments({
  comments,
  videoId,
  profileId,
}: commentsProps) {
  console.log('video comments', comments)
  const [commentTxt, setcommentTxt] = useState('')
  const [isLoading, setisLoading] = useState(false)

  const note = {
    characterId: profileId,
    noteId: videoId,
  }

  /* const handleComment = async () => {
      setisLoading(true)
      try{
       
        postNoteForNote.mutate({
          note,
          metadata: {
            content: commentTxt,
            sources: ["xtube_v1"],
            external_urls: ["zenvid.xyz"],
            tags: ["comment"],
          },
        });
        setisLoading(false)
      }catch (error){
        setisLoading(false)
        toast({
          title : "Something went wrong",
           description : error
        })
      }
     }*/
  if (comments?.data?.list < 1) {
    return (
      <div className=' flex flex-col items-center justify-center'>
        <div className='my-2 flex w-full flex-col items-end justify-end gap-3'>
          <textarea
            value={commentTxt}
            onChange={(e) => setcommentTxt(e.target.value)}
            placeholder='Say something about this...'
            className='no h-14 w-full resize-none rounded-xl border border-gray-400 p-1 focus:outline-none dark:border-gray-600'
          />
          <button
            className='rounded-xl bg-black px-4 py-1.5 text-white dark:bg-white dark:text-black '
            onClick={handleComment}
          >
            Send
          </button>
        </div>
        <div className='mb-2 flex flex-col items-center justify-center gap-3'>
          <Image
            src={`/img/no-comment.svg`}
            width={400}
            height={400}
            alt='no comment'
            className='h-28 w-28'
          />
          <h1 className='text-sm'>No comment Be the First one to comment</h1>
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1>Comments</h1>

      <div className='my-2 flex flex-col items-end justify-end gap-3'>
        <textarea
          value={commentTxt}
          onChange={(e) => setcommentTxt(e.target.value)}
          placeholder='Say something about this...'
          className='no h-14 w-full resize-none rounded-xl border border-gray-400 p-1 focus:outline-none dark:border-gray-600'
        />
        <button className='rounded-xl bg-black px-4 py-1.5 text-white dark:bg-white dark:text-black '>
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <ClipLoader loading={isLoading} size={14} color='red' />{' '}
              <p className='text-sm'>Sending</p>{' '}
            </div>
          ) : (
            <p>Send</p>
          )}
        </button>
      </div>

      <div>
        {comments?.data?.list?.map((item, i) => (
          <CommentCard
            key={i}
            comment={item?.metadata?.content}
            creator={item?.character}
            commentId={item?.noteId}
            createdAt={item?.createdAt}
          />
        ))}
      </div>
    </div>
  )
}
