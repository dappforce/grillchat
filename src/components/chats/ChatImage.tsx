import useRandomColor from '@/hooks/useRandomColor'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image, { ImageProps } from 'next/image'
import React, { ComponentProps } from 'react'

export type ChatImageProps = ComponentProps<'div'> & {
  chatTitle?: string
  chatId?: string
  image?: ImageProps['src'] | JSX.Element
  isImageInCidFormat?: boolean
  rounding?: 'circle' | 'xl' | '2xl'
}

export default function ChatImage({
  chatId,
  chatTitle,
  image,
  isImageInCidFormat = true,
  rounding = 'circle',
  ...props
}: ChatImageProps) {
  let initial = chatTitle?.charAt(0)
  if (chatTitle?.includes(' ')) {
    const [, secondWord] = chatTitle.split(' ')
    if (secondWord && secondWord.length > 0) {
      initial += secondWord.charAt(0)
    }
  }

  const bgColor = useRandomColor(chatId || chatTitle, 'light')

  const roundingMap = {
    circle: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }

  return (
    <div
      {...props}
      style={{ backgroundClip: 'padding-box' }}
      className={cx(
        getCommonClassNames('chatImageBackground'),
        roundingMap[rounding],
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
                style={{ background: bgColor }}
              >
                <text
                  x='50%'
                  y='50%'
                  dominantBaseline='central'
                  textAnchor='middle'
                  fontSize='32'
                  fill='white'
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
