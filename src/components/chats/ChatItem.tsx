import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/className'
import { getTimeRelativeToNow } from '@/utils/date'
import { ComponentProps, useReducer } from 'react'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'
import AddressAvatar from '../AddressAvatar'
import Button from '../Button'
import LinkText from '../LinkText'
import Modal, { ModalFunctionalityProps } from '../Modal'

export type ChatItemProps = Omit<ComponentProps<'div'>, 'children'> & {
  text: string
  senderAddress: string
  sentDate: Date | string | number
  isSent?: boolean
  isMyMessage?: boolean
}

type CheckMarkModalReducerState = {
  isOpen: boolean
  variant: CheckMarkModalVariant | ''
}
const checkMarkModalReducer = (
  state: CheckMarkModalReducerState,
  action: CheckMarkModalVariant | ''
): CheckMarkModalReducerState => {
  if (action === '') {
    return { ...state, isOpen: false }
  }
  return { isOpen: true, variant: action }
}

export default function ChatItem({
  text,
  senderAddress,
  sentDate,
  isSent,
  isMyMessage,
  ...props
}: ChatItemProps) {
  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })
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
        <AddressAvatar
          address={senderAddress}
          className='relative top-1 flex-shrink-0'
        />
      )}
      <div
        className={cx(
          'relative flex flex-col gap-0.5 rounded-3xl py-2 px-4',
          isMyMessage ? 'bg-background-primary' : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center'>
            <span className='mr-2 text-sm text-text-secondary'>
              {truncateAddress(senderAddress)}
            </span>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
          </div>
        )}
        <p>{text}</p>
        {isMyMessage && (
          <div
            className={cx('flex items-center gap-1', isMyMessage && 'self-end')}
          >
            <span className='text-xs text-text-muted'>{relativeTime}</span>
            <Button
              variant='transparent'
              size='noPadding'
              withRingInteraction={false}
              onClick={() => dispatch(isSent ? 'recorded' : 'recording')}
            >
              {isSent ? (
                <IoCheckmarkDoneOutline className='text-sm' />
              ) : (
                <IoCheckmarkOutline className={cx('text-sm text-text-muted')} />
              )}
            </Button>
          </div>
        )}
      </div>
      <CheckMarkExplanationModal
        isOpen={checkMarkModalState.isOpen}
        variant={checkMarkModalState.variant || 'recording'}
        closeModal={() => dispatch('')}
      />
    </div>
  )
}

const variants = {
  recording: {
    title: 'Recording message',
    icon: <IoCheckmarkOutline className='text-text-muted' />,
    desc: (
      <span>
        Your message is being processed. In the next few seconds, it will be
        saved to the blockchain, after which you will see this icon:{' '}
        <IoCheckmarkDoneOutline className='inline text-text' />
      </span>
    ),
  },
  recorded: {
    title: 'Message recorded',
    icon: <IoCheckmarkDoneOutline />,
    desc: (
      <span>
        Your censorship-resistant message has been stored on{' '}
        <LinkText href='https://ipfs.tech/' openInNewTab variant='primary'>
          IPFS
        </LinkText>{' '}
        and the{' '}
        <LinkText
          href='https://subsocial.network/'
          openInNewTab
          variant='primary'
        >
          Subsocial blockchain
        </LinkText>
        .
      </span>
    ),
  },
}
type CheckMarkModalVariant = keyof typeof variants
function CheckMarkExplanationModal({
  variant,
  ...props
}: ModalFunctionalityProps & { variant: CheckMarkModalVariant }) {
  const { title, icon, desc } = variants[variant]

  return (
    <Modal {...props} title={title} withCloseButton>
      <div className='flex flex-col items-center'>
        <div className='my-6 flex justify-center text-9xl'>{icon}</div>
        <p className='text-text-muted'>{desc}</p>
      </div>
    </Modal>
  )
}
