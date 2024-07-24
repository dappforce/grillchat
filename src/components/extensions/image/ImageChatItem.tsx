import MediaLoader from '@/components/MediaLoader'
import UnapprovedMemeCount from '@/components/chats/UnapprovedMemeCount'
import { cx } from '@/utils/class-names'
import { useInView } from 'react-intersection-observer'
import CommonChatItem from '../common/CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getPostExtensionProperties } from '../utils'

export default function ImageChatItem(props: ExtensionChatItemProps) {
  const { message } = props
  const { inView, ref } = useInView({
    triggerOnce: true,
  })

  const firstExtension = message.content?.extensions?.[0]
  const imageProperties = getPostExtensionProperties(
    firstExtension,
    'subsocial-image'
  )

  if (!imageProperties) return null

  return (
    <CommonChatItem
      {...props}
      showSuperLikeWhenZero
      othersMessage={{ children: 'middle', checkMark: 'bottom' }}
      myMessageConfig={{ children: 'middle', checkMark: 'adaptive-inside' }}
      className={cx('max-w-xs', props.className)}
    >
      {({ isMyMessage }) => (
        <div
          className={cx('relative flex flex-col', !isMyMessage && 'mt-1')}
          ref={ref}
        >
          {props.showApproveButton && !isMyMessage && inView && (
            <UnapprovedMemeCount
              className='absolute bottom-2 right-1.5 z-10 bg-black/50 text-white'
              address={message.struct.ownerId}
              chatId={props.chatId}
            />
          )}
          <MediaLoader
            containerClassName='rounded-[4px] overflow-hidden w-full cursor-pointer'
            placeholderClassName={cx('w-[320px] aspect-square')}
            className='w-[320px] object-contain'
            src={imageProperties.image}
          />
        </div>
      )}
    </CommonChatItem>
  )
}
