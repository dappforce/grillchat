import { useSendEvent } from '@/stores/analytics'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getTimeRelativeToNow } from '@/utils/date'
import { getExplorerUrl } from '@/utils/explorer'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { generateRandomColor } from '@/utils/random-colors'
import Linkify from 'linkify-react'
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
  cid?: string
  blockNumber?: number
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
  blockNumber: blockHash,
  cid,
  ...props
}: ChatItemProps) {
  const sendEvent = useSendEvent()

  const [checkMarkModalState, dispatch] = useReducer(checkMarkModalReducer, {
    isOpen: false,
    variant: '',
  })
  const relativeTime = getTimeRelativeToNow(sentDate)
  const senderColor = generateRandomColor(senderAddress)

  const onCheckMarkClick = () => {
    const checkMarkType: CheckMarkModalVariant = isSent
      ? 'recorded'
      : 'recording'
    sendEvent('click check_mark_button', { type: checkMarkType })
    dispatch(checkMarkType)
  }

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
        <AddressAvatar address={senderAddress} className='flex-shrink-0' />
      )}
      <div
        className={cx(
          'relative flex flex-col gap-0.5 overflow-hidden rounded-2xl py-1.5 px-2.5',
          isMyMessage ? 'bg-background-primary' : 'bg-background-light'
        )}
      >
        {!isMyMessage && (
          <div className='flex items-center'>
            <span
              className='mr-2 text-sm text-text-secondary'
              style={{ color: senderColor }}
            >
              {truncateAddress(senderAddress)}
            </span>
            <span className='text-xs text-text-muted'>{relativeTime}</span>
          </div>
        )}
        <p className='whitespace-pre-wrap break-words text-base'>
          <Linkify
            options={{
              render: ({ content, attributes }) => (
                <LinkText
                  {...attributes}
                  href={attributes.href}
                  variant={isMyMessage ? 'default' : 'secondary'}
                  className={cx('underline')}
                  openInNewTab
                >
                  {content}
                </LinkText>
              ),
            }}
          >
            {text}
          </Linkify>
        </p>
        {isMyMessage && (
          <div
            className={cx('flex items-center gap-1', isMyMessage && 'self-end')}
          >
            <span className='text-xs text-text-muted'>{relativeTime}</span>
            <Button
              variant='transparent'
              size='noPadding'
              interactive='brightness-only'
              onClick={onCheckMarkClick}
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
        blockNumber={blockHash}
        cid={cid}
      />
    </div>
  )
}

type CheckMarkDescData = {
  blockNumber?: number
  cid?: string
}
type CheckMarkExplanationModalProps = ModalFunctionalityProps & {
  variant: CheckMarkModalVariant
} & CheckMarkDescData

const variants = {
  recording: {
    title: 'Recording message',
    icon: <IoCheckmarkOutline className='text-text-muted' />,
    desc: () => (
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
    desc: ({ blockNumber, cid }) => (
      <span>
        Your censorship-resistant message has been stored on{' '}
        <LinkText
          href={cid ? getIpfsContentUrl(cid) : 'https://ipfs.tech/'}
          openInNewTab
          variant='primary'
        >
          IPFS
        </LinkText>{' '}
        and the{' '}
        <LinkText
          href={
            blockNumber
              ? getExplorerUrl(blockNumber)
              : 'https://subsocial.network/'
          }
          openInNewTab
          variant='primary'
        >
          Subsocial blockchain
        </LinkText>
        .
      </span>
    ),
  },
} satisfies {
  [key: string]: {
    title: string
    icon: JSX.Element
    desc: (data: CheckMarkDescData) => JSX.Element
  }
}
type CheckMarkModalVariant = keyof typeof variants
function CheckMarkExplanationModal({
  variant,
  blockNumber,
  cid,
  ...props
}: CheckMarkExplanationModalProps) {
  const { title, icon, desc } = variants[variant]

  return (
    <Modal {...props} title={title} withCloseButton>
      <div className='flex flex-col items-center'>
        <div className='my-6 flex justify-center text-8xl'>{icon}</div>
        <p className='text-text-muted'>{desc({ blockNumber, cid })}</p>
      </div>
    </Modal>
  )
}
