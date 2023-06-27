import ClickableMedia from '@/components/ClickableMedia'
import MediaLoader from '@/components/MediaLoader'
import { cx } from '@/utils/class-names'
import CommonChatItem from '../CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getMessageExtensionProperties } from '../utils'

export default function ImageChatItem(props: ExtensionChatItemProps) {
  const { message } = props

  const firstExtension = message.content?.extensions?.[0]
  const imageProperties = getMessageExtensionProperties(
    firstExtension,
    'subsocial-image'
  )

  if (!imageProperties) return null

  return (
    <CommonChatItem
      {...props}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      className='max-w-xs'
    >
      {({ isMyMessage, isSent, relativeTime }) => (
        <div className='flex flex-col [&:not(:first-child)]:mt-1'>
          <ClickableMedia
            src={imageProperties.image}
            alt=''
            trigger={(onClick) => (
              <MediaLoader
                containerClassName='rounded-[4px] overflow-hidden w-full cursor-pointer'
                placeholderClassName={cx('w-[320px] aspect-square')}
                className='w-[320px] object-contain'
                src={imageProperties.image}
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
              />
            )}
          />
        </div>
      )}
    </CommonChatItem>
  )
}
