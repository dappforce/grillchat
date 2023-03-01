import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/className'
import { getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps } from 'react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import AddressAvatar from '../AddressAvatar'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  text: string
  senderAddress: string
  sentDate: Date | string | number
  isSent?: boolean
}

export default function ChatItem({
  text,
  senderAddress,
  sentDate,
  isSent,
  ...props
}: ChatItemProps) {
  const address = useMyAccount((state) => state.address)
  const isMyMessage = address === senderAddress

  const relativeTime = getTimeRelativeToNow(sentDate)

  return (
    <div
      {...props}
      className={cx(
        'flex items-start justify-start gap-2',
        isMyMessage && 'flex-row-reverse',
        props.className
      )}
    >
      {!isMyMessage && (
        <AddressAvatar address={senderAddress} className='relative top-1' />
      )}
      <div
        className={cx(
          'relative flex flex-col gap-0.5 rounded-3xl py-2 px-4',
          isMyMessage ? 'bg-background-primary' : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center'>
            <span className='mr-2 text-sm text-text-primary'>
              {truncateAddress(senderAddress)}
            </span>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
          </div>
        )}
        <p>{text}</p>
        {isMyMessage && (
          <div className='flex items-center gap-1'>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
            {isSent ? (
              <IoCheckmarkDoneOutline className='text-sm' />
            ) : (
              <IoCheckmarkOutline className={cx('text-sm text-text-muted')} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
