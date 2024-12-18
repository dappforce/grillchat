import ChatForm, { ChatFormProps } from '@/components/chats/ChatForm'
import Modal, { ModalProps } from '@/components/modals/Modal'
import { SendMessageParams } from '@/services/subsocial/commentIds/types'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { useEffect } from 'react'

export type BeforeMessageResult = {
  newMessageParams?: SendMessageParams
  txPrevented: boolean
}

export type CommonExtensionModalProps = ModalProps &
  Pick<
    ChatFormProps,
    | 'buildAdditionalTxParams'
    | 'chatId'
    | 'hubId'
    | 'sendButtonText'
    | 'autofocus'
    | 'onSubmit'
    | 'mustHaveMessageBody'
  > & {
    disableSendButton?: boolean
    showChatForm?: boolean
    withDivider?: boolean
    beforeMesageSend?: (
      messageParams: SendMessageParams
    ) => Promise<BeforeMessageResult>
  }

export default function CommonExtensionModal({
  chatId,
  hubId,
  sendButtonText,
  disableSendButton,
  mustHaveMessageBody = false,
  autofocus,
  showChatForm = true,
  withDivider = true,
  buildAdditionalTxParams,
  beforeMesageSend,
  onSubmit,
  ...props
}: CommonExtensionModalProps) {
  const setShowEmptyPrimaryChatInput = useMessageData(
    (state) => state.setShowEmptyPrimaryChatInput
  )
  useEffect(() => {
    setShowEmptyPrimaryChatInput(props.isOpen)
  }, [props.isOpen, setShowEmptyPrimaryChatInput])

  const commonClassName = cx('px-5 md:px-6')

  const isUsingBigButton = !!sendButtonText

  return (
    <Modal
      {...props}
      withCloseButton
      contentClassName='!pb-0 !px-0'
      titleClassName={commonClassName}
      descriptionClassName={commonClassName}
    >
      <div
        className={cx(commonClassName, {
          ['border-b border-border-gray pb-6']: withDivider,
        })}
      >
        {props.children}
      </div>
      {showChatForm && (
        <ChatForm
          autofocus={!!autofocus}
          chatId={chatId}
          hubId={hubId}
          mustHaveMessageBody={mustHaveMessageBody}
          beforeMesageSend={beforeMesageSend}
          sendButtonText={sendButtonText}
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
      )}
    </Modal>
  )
}
