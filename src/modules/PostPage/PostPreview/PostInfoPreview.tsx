import { PostData } from '@subsocial/api/types'

type PostInfoPreviewProps = {
  post: PostData
}

const PostInfoPreview = ({ post }: PostInfoPreviewProps) => {
  const { struct, content } = post

  if (!struct || !content) return null

  return (
    <div className='flex justify-between gap-2'>
      <div className='flex gap-2'>
        <span className='text-[32px] font-medium leading-[1.25]'>
          {content.title}
        </span>
      </div>
    </div>
  )
}
