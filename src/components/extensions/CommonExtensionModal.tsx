import { cx } from '@/utils/class-names'
import ChatForm, { ChatFormProps } from '../chats/ChatForm'
import Modal, { ModalProps } from '../modals/Modal'

export type CommonExtensionModalProps = ModalProps & {
  formProps: ChatFormProps
}

export default function CommonExtensionModal({
  formProps,
  ...props
}: CommonExtensionModalProps) {
  const commonClassName = cx('px-5 md:px-6')

  const isUsingBigButton = !!formProps.sendButtonText

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
        {...formProps}
        className={cx(
          'p-1',
          isUsingBigButton && 'pb-5 md:pb-6',
          formProps.className
        )}
        inputProps={{
          ...formProps.inputProps,
          className: cx(
            'rounded-none bg-transparent pl-4 md:pl-5 py-4 pr-20',
            !isUsingBigButton && 'rounded-b-2xl',
            isUsingBigButton && '!ring-0',
            formProps.inputProps?.className
          ),
        }}
        sendButtonProps={{
          ...formProps.sendButtonProps,
          className: cx(
            !isUsingBigButton ? 'mr-4' : 'mx-5 md:px-6',
            formProps.sendButtonProps?.className
          ),
        }}
      />
    </Modal>
  )
}
