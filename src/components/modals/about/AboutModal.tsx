import ActionCard, { ActionCardProps } from '@/components/ActionCard'
import ChatImage from '@/components/chats/ChatImage'
import DataCard, { DataCardProps } from '@/components/DataCard'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'

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
      <div className='mt-4 flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <ChatImage chatTitle={title} className='h-20 w-20' image={image} />
          <div className='flex flex-col'>
            <h1 className='text-2xl font-medium'>{title}</h1>
            <span className='text-text-muted'>{subtitle}</span>
          </div>
        </div>
        <DataCard data={contentList} />
        <ActionCard actions={actionMenu ?? []} size='sm' />
        {bottomElement}
      </div>
    </Modal>
  )
}
