import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image, { ImageProps } from 'next/image'
import React, { ComponentProps } from 'react'

export type ChatImageProps = ComponentProps<'div'> & {
  chatTitle?: string
  image?: ImageProps['src'] | JSX.Element
  isImageInCidFormat?: boolean
  isImageCircle?: boolean
}

export default function ChatImage({
  chatTitle,
  image,
  isImageInCidFormat = true,
  isImageCircle = true,
  ...props
}: ChatImageProps) {
  // TODO: create initial for avatar with chatTitle

  return (
    <div
      {...props}
      style={{ backgroundClip: 'padding-box' }}
      className={cx(
        getCommonClassNames('chatImageBackground'),
        isImageCircle ? 'rounded-full' : 'rounded-2xl',
        'h-12 w-12 flex-shrink-0'
      )}
    >
      {React.isValidElement(image)
        ? image
        : image && (
            <Image
              className='h-full w-full object-cover'
              src={
                isImageInCidFormat
                  ? getIpfsContentUrl(image as string)
                  : (image as string)
              }
              sizes='150px'
              width={120}
              height={120}
              alt=''
            />
          )}
    </div>
  )
}
