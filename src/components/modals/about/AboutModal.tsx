import ActionCard, { ActionCardProps } from '@/components/ActionCard'
import ChatImage from '@/components/chats/ChatImage'
import DataCard, { DataCardProps } from '@/components/DataCard'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { ReactNode } from 'react'

export type AboutModalProps = ModalFunctionalityProps & {
  id: string
  entityTitle: string | undefined
  modalTitle?: ReactNode
  image: string | undefined
  isImageCircle?: boolean
  subtitle: ReactNode
  contentList: DataCardProps['data']
  actionMenu?: ActionCardProps['actions']
  bottomElement?: JSX.Element | null
}

export default function AboutModal({
  id,
  entityTitle,
  modalTitle,
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
          <ChatImage
            chatId={id}
            chatTitle={entityTitle}
            className='h-20 w-20'
            image={image}
            rounding={isImageCircle ? 'circle' : '2xl'}
          />
          <div className='flex flex-col gap-1'>
            <h1 className='pr-8 text-xl font-medium leading-tight'>
              {modalTitle || entityTitle}
            </h1>
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
