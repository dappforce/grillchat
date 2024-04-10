import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { PostData } from '@subsocial/api/types'
import Image from 'next/image'
import { useState } from 'react'

type PostCoverProps = {
  post: PostData
}

const PostCover = ({ post }: PostCoverProps) => {
  const [shouldImageBeCropped, setShouldImageBeCropped] = useState(true)
  const postContent = post.content

  const postImage = postContent?.image

  if (!postContent || !postImage) return null

  const onImgLoad = (e: any) => {
    const img = e.target as HTMLImageElement
    const { naturalHeight, naturalWidth } = img
    const isTallerThan16By9 = naturalWidth / naturalHeight < 16 / 9
    setShouldImageBeCropped(isTallerThan16By9)
  }

  const wrapperClassName = 'relative pt-[calc(9/16*100%)]'
  const croppedImageClassName = 'insent-0 !absolute w-full h-full top-0'

  return (
    <div className='relative w-full overflow-hidden rounded-[5px] bg-background-light'>
      <div
        className={cx(
          { [wrapperClassName]: shouldImageBeCropped },
          'absolute inset-0 h-full w-full origin-center scale-110 blur-[20px]'
        )}
      >
        <Image
          src={getIpfsContentUrl(postImage)}
          className={cx('h-full w-full object-cover', {
            [croppedImageClassName]: shouldImageBeCropped,
          })}
          alt=''
          fill
          quality={1}
          onLoad={onImgLoad}
        />
      </div>
      <div className={cx({ [wrapperClassName]: shouldImageBeCropped })}>
        <Image
          src={getIpfsContentUrl(postImage)}
          className={cx('!relative h-full w-full object-contain', {
            [croppedImageClassName]: shouldImageBeCropped,
          })}
          alt='asdasd'
          quality={50}
          fill
          onLoad={onImgLoad}
        />
      </div>
    </div>
  )
}

export default PostCover
