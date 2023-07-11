import ActionCard, { ActionCardProps } from '@/components/ActionCard'
import DataCard, { DataCardProps } from '@/components/DataCard'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import Image from 'next/image'

export type AboutModalProps = ModalFunctionalityProps & {
  title: string | undefined
  image: string | undefined
  isImageCircle?: boolean
  subtitle: string
  contentList: DataCardProps['data']
  actionMenu?: ActionCardProps['actions']
  bottomElement?: JSX.Element | null
}

export default function AboutModal({
  title,
  subtitle,
  isImageCircle = true,
  image,
  contentList,
  actionMenu,
  bottomElement,
  ...props
}: AboutModalProps) {
  return (
    <Modal {...props} withCloseButton>
      <div className='mt-4 flex flex-col items-center gap-4'>
        <div className='flex flex-col items-center text-center'>
          <div
            className={cx(
              getCommonClassNames('chatImageBackground'),
              isImageCircle ? 'rounded-full' : 'rounded-2xl',
              'h-20 w-20'
            )}
          >
            {image && (
              <Image
                className='h-full w-full object-cover'
                src={getIpfsContentUrl(image ?? '')}
                height={80}
                width={80}
                alt=''
              />
            )}
          </div>
          <h1 className='mt-4 text-2xl font-medium'>{title}</h1>
          <span className='text-text-muted'>{subtitle}</span>
        </div>
        <DataCard data={contentList} />
        <ActionCard actions={actionMenu ?? []} />
        {bottomElement}
      </div>
    </Modal>
  )
}
