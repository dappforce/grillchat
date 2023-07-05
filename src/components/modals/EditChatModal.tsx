import { PostData } from '@subsocial/api/types'
import Button from '../Button'
import Input from '../inputs/Input'
import TextArea from '../inputs/TextArea'
import Modal, { ModalFunctionalityProps, ModalProps } from './Modal'

export type EditChatModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick'> & {
    chat: PostData
  }

export default function EditChatModal({ chat, ...props }: EditChatModalProps) {
  return (
    <Modal {...props} title='✏️ Edit chat' withCloseButton>
      <div className='flex flex-col gap-4'>
        <Input value={chat.content?.title} variant='fill-bg' />
        <TextArea value={chat.content?.body} variant='fill-bg' />
        <Button size='lg'>Save changes</Button>
      </div>
    </Modal>
  )
}
