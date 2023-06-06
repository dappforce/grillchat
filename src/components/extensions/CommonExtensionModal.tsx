import { cx } from '@/utils/class-names'
import ChatForm from '../chats/ChatForm'
import Modal, { ModalProps } from '../modals/Modal'

export type CommonExtensionModalProps = ModalProps

export default function CommonExtensionModal({
  ...props
}: CommonExtensionModalProps) {
  const commonClassName = cx('px-5 md:px-6')

  return (
    <Modal
      {...props}
      withCloseButton
      contentClassName='pb-0 px-0'
      titleClassName={commonClassName}
      descriptionClassName={commonClassName}
    >
      <div className={cx(commonClassName, 'border-b border-border-gray pb-6')}>
        {props.children}
      </div>
      <ChatForm
        className='pr-4'
        chatId=''
        inputProps={{
          className: cx('rounded-none bg-transparent pl-5 md:pl-6 py-5'),
        }}
      />
    </Modal>
  )
}
