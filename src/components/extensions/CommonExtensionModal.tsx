import { cx } from '@/utils/class-names'
import ChatForm, { ChatFormProps } from '../chats/ChatForm'
import Modal, { ModalProps } from '../modals/Modal'

export type CommonExtensionModalProps = ModalProps & ChatFormProps

export default function CommonExtensionModal({
  sendButtonText,
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
        className={cx(!sendButtonText ? '' : 'pb-5 md:pb-6')}
        chatId='1001'
        inputProps={{
          className: cx('rounded-none bg-transparent pl-5 md:pl-6 py-5 pr-20'),
        }}
        sendButtonProps={{
          className: cx(!sendButtonText ? 'mr-4' : 'mx-5 md:px-6'),
        }}
        sendButtonText={sendButtonText}
      />
    </Modal>
  )
}
