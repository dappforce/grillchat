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
  let initial = chatTitle?.charAt(0)
  if (chatTitle?.includes(' ')) {
    const [, secondWord] = chatTitle.split(' ')
    if (secondWord && secondWord.length > 0) {
      initial += secondWord.charAt(0)
    }
  }

  return (
    <div
      {...props}
      style={{ backgroundClip: 'padding-box' }}
      className={cx(
        getCommonClassNames('chatImageBackground'),
        isImageCircle ? 'rounded-full' : 'rounded-2xl',
        'h-12 w-12 flex-shrink-0',
        props.className
      )}
    >
      {(() => {
        if (!image)
          return (
            <div className='flex h-full w-full items-center justify-center uppercase text-slate-700'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 75 75'
                preserveAspectRatio='xMinYMid meet'
              >
                <text
                  x='50%'
                  y='50%'
                  dominantBaseline='central'
                  textAnchor='middle'
                  fontSize='32'
                  fill='#334155'
                >
                  {initial}
                </text>
              </svg>
            </div>
          )

        return React.isValidElement(image) ? (
          image
        ) : (
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
        )
      })()}
    </div>
  )
}
