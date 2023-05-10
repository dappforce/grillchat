import LinkText from '@/components/LinkText'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { getExplorerUrl } from '@/utils/explorer'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { IoCheckmarkDoneOutline, IoCheckmarkOutline } from 'react-icons/io5'

type CheckMarkDescData = {
  blockNumber?: number
  cid?: string
}
export type CheckMarkExplanationModalProps = ModalFunctionalityProps & {
  variant: CheckMarkModalVariant
} & CheckMarkDescData

const variants = {
  recording: {
    title: 'Recording message',
    icon: <IoCheckmarkOutline />,
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
export type CheckMarkModalVariant = keyof typeof variants
export default function CheckMarkExplanationModal({
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
