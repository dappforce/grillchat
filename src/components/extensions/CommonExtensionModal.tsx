import { cx } from '@/utils/class-names'
import ChatForm, { ChatFormProps } from '../chats/ChatForm'
import Modal, { ModalProps } from '../modals/Modal'

export type CommonExtensionModalProps = ModalProps &
  Pick<
    ChatFormProps,
    | 'buildAdditionalTxParams'
    | 'chatId'
    | 'sendButtonText'
    | 'autofocus'
    | 'onSubmit'
    | 'mustHaveMessageBody'
  > & {
    disableSendButton?: boolean
  }

export default function CommonExtensionModal({
  chatId,
  sendButtonText,
  disableSendButton,
  mustHaveMessageBody = false,
  autofocus,
  buildAdditionalTxParams,
  onSubmit,
  ...props
}: CommonExtensionModalProps) {
  const commonClassName = cx('px-5 md:px-6')

  const isUsingBigButton = !!sendButtonText

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
        autofocus={!!autofocus}
        chatId={chatId}
        mustHaveMessageBody={mustHaveMessageBody}
        className={cx(isUsingBigButton && 'pb-5 md:pb-6')}
        inputProps={{
          className: cx(
            'rounded-none bg-transparent pl-4 md:pl-5 py-4 pr-20 !ring-0',
            !isUsingBigButton && 'rounded-b-2xl'
          ),
        }}
        sendButtonProps={{
          disabled: disableSendButton,
          className: cx(!isUsingBigButton ? 'mr-4' : 'mx-5 md:px-6'),
        }}
        buildAdditionalTxParams={buildAdditionalTxParams}
        onSubmit={() => {
          onSubmit?.()
          props.closeModal()
        }}
      />
    </Modal>
  )
}
