import Send from '@/assets/icons/send.svg'
import Button, { ButtonProps } from '@/components/Button'
import TextArea, { TextAreaProps } from '@/components/inputs/TextArea'
import EmailSubscribeModal from '@/components/modals/EmailSubscribeModal'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import useAutofocus from '@/hooks/useAutofocus'
import useRequestTokenAndSendMessage from '@/hooks/useRequestTokenAndSendMessage'
import { showErrorToast } from '@/hooks/useToastError'
import { useConfigContext } from '@/providers/ConfigProvider'
import { getPostQuery } from '@/services/api/query'
import {
  SendMessageParams,
  useSendMessage,
} from '@/services/subsocial/commentIds'
import { useSendEvent } from '@/stores/analytics'
import { useExtensionData } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { hasSentMessageStorage, useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import dynamic from 'next/dynamic'
import {
  ComponentProps,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import { IoRefresh } from 'react-icons/io5'
import { BeforeMessageResult } from '../extensions/common/CommonExtensionModal'
import { interceptPastedData } from '../extensions/config'
import { useName } from '../Name'
import SubsocialProfileModal from '../subsocial-profile/SubsocialProfileModal'

const CaptchaInvisible = dynamic(
  () => import('@/components/captcha/CaptchaInvisible'),
  {
    ssr: false,
  }
)

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  hubId: string
  chatId: string
  onSubmit?: (isEditing?: boolean) => void
  disabled?: boolean
  mustHaveMessageBody?: boolean
  inputProps?: TextAreaProps
  buildAdditionalTxParams?: () =>
    | Partial<SendMessageParams>
    | Promise<Partial<SendMessageParams>>
  sendButtonText?: string
  sendButtonProps?: ButtonProps
  isPrimary?: boolean
  beforeMesageSend?: (
    messageParams: SendMessageParams
  ) => Promise<BeforeMessageResult>
  autofocus?: boolean
}

function processMessage(message: string) {
  return message.trim()
}

export default function ChatForm({
  className,
  hubId,
  chatId,
  onSubmit,
  disabled,
  mustHaveMessageBody = true,
  inputProps,
  autofocus = true,
  buildAdditionalTxParams,
  sendButtonText,
  sendButtonProps,
  isPrimary,
  beforeMesageSend,
  ...props
}: ChatFormProps) {
  const replyTo = useMessageData((state) => state.replyTo)
  const messageToEdit = useMessageData((state) => state.messageToEdit)
  const clearAction = useMessageData((state) => state.clearAction)
  const setMessageBody = useMessageData((state) => state.setMessageBody)

  const { data: editedMessage } = getPostQuery.useQuery(messageToEdit, {
    enabled: !!messageToEdit,
  })
  const editedMessageBody = editedMessage?.content?.body
  useEffect(() => {
    if (!editedMessageBody) return
    setMessageBody(editedMessageBody)
  }, [editedMessageBody, setMessageBody])

  useLoadUnsentMessage(chatId)

  const myAddress = useMyAccount((state) => state.address)
  const { ensName, profile } = useName(myAddress ?? '')
  const hasName = ensName || profile?.profileSpace?.name

  const [isOpenNameModal, setIsOpenNameModal] = useState(false)

  const sendEvent = useSendEvent()
  const incrementMessageCount = useMessageData(
    (state) => state.incrementMessageCount
  )

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const hasEnoughEnergy = useMyAccount(
    (state) => (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
  )
  const [isRequestingEnergy, setIsRequestingEnergy] = useState(false)

  const { mutateAsync: requestTokenAndSendMessage } =
    useRequestTokenAndSendMessage({
      onError: (error, variables) => {
        showErrorSendingMessageToast(
          error,
          'Failed to register or send message',
          variables
        )
      },
    })

  let messageBody = useMessageData((state) => state.messageBody)
  const showEmptyPrimaryChatInput = useMessageData(
    (state) => state.showEmptyPrimaryChatInput
  )
  if (isPrimary && showEmptyPrimaryChatInput) {
    messageBody = ''
  }

  const { mutate: sendMessage } = useSendMessage({
    onError: (error, variables) => {
      showErrorSendingMessageToast(error, 'Failed to send message', variables)
    },
  })

  const { enableInputAutofocus } = useConfigContext()
  const { autofocus: runAutofocus } = useAutofocus()
  useEffect(() => {
    if (!autofocus || enableInputAutofocus === false) return
    runAutofocus({
      ref: textAreaRef,
      autofocusInTouchDevices: enableInputAutofocus === true,
    })
  }, [runAutofocus, autofocus, enableInputAutofocus])

  useEffect(() => {
    if (replyTo || messageToEdit) textAreaRef.current?.focus()
  }, [replyTo, messageToEdit])

  useEffect(() => {
    setIsRequestingEnergy(false)
  }, [hasEnoughEnergy])

  const shouldSendMessage =
    isRequestingEnergy || (isLoggedIn && hasEnoughEnergy)

  const isDisabled =
    (mustHaveMessageBody && !processMessage(messageBody)) ||
    sendButtonProps?.disabled

  const resetForm = () => {
    setMessageBody('')
    clearAction?.()
  }

  const handleSubmit = async (captchaToken: string | null) => {
    if (
      shouldSendMessage &&
      'virtualKeyboard' in navigator &&
      typeof (navigator.virtualKeyboard as any).show === 'function'
    ) {
      ;(navigator.virtualKeyboard as any).show()
    }

    const processedMessage = processMessage(messageBody)
    if (isDisabled) return

    const additionalTxParams = await buildAdditionalTxParams?.()

    const sendMessageParams = {
      message: processedMessage,
      chatId,
      hubId,
      replyTo,
      messageIdToEdit: messageToEdit,
      ...additionalTxParams,
    }

    const { newMessageParams, txPrevented } =
      (await beforeMesageSend?.(sendMessageParams)) || {}

    if (txPrevented) return

    const messageParams = newMessageParams || sendMessageParams
    if (editedMessage?.content?.body === messageParams.message) {
      resetForm()
      return
    }

    if (!hasSentMessageStorage.get() && !hasName) {
      setTimeout(() => {
        setIsOpenNameModal(true)
      }, 1000)
    }
    hasSentMessageStorage.set('true')

    if (shouldSendMessage) {
      resetForm()
      sendMessage(messageParams)
    } else {
      if (!captchaToken) return
      resetForm()
      requestTokenAndSendMessage({
        captchaToken,
        ...messageParams,
      })
      setIsRequestingEnergy(true)
    }

    // // TODO: wrap it into hook
    // const storage = new SessionStorage(() => 'FIRST_MESSAGE_SENT')
    // const isFirstMessageInSession = storage.get()
    // console.log('isFirstMessageInSession', isFirstMessageInSession)
    // if (!isFirstMessageInSession) {
    //   sendEvent('send_first_message', { chatId, title: chatTitle })
    //   storage.set('true')
    // }
    const firstExtension = sendMessageParams.extensions?.[0]
    sendEvent('send_message', { extensionType: firstExtension?.id })

    onSubmit?.(!!messageParams.messageIdToEdit)
    incrementMessageCount()
  }

  return (
    <>
      <CaptchaInvisible>
        {(runCaptcha) => {
          const submitForm = async (e?: SyntheticEvent) => {
            e?.preventDefault()
            if (shouldSendMessage) {
              handleSubmit(null)
              return
            }
            const token = await runCaptcha()
            handleSubmit(token)
          }

          const renderSendButton = (classNames: string) => (
            <Button
              onTouchEnd={(e) => {
                // For mobile, to prevent keyboard from hiding
                if (shouldSendMessage) {
                  submitForm(e)
                }
              }}
              tabIndex={-1}
              onClick={submitForm}
              size='circle'
              variant={isDisabled ? 'mutedOutline' : 'primary'}
              {...sendButtonProps}
              className={cx(classNames, sendButtonProps?.className)}
            >
              <Send className='relative top-px h-4 w-4' />
            </Button>
          )

          return (
            <form
              onSubmit={submitForm}
              {...props}
              className={cx('flex w-full flex-col gap-2', className)}
            >
              <TextArea
                onPaste={(e) => {
                  const clipboardData = e.clipboardData
                  interceptPastedData(clipboardData, e)
                }}
                placeholder='Message...'
                rows={1}
                autoComplete='off'
                autoCapitalize='sentences'
                autoCorrect='off'
                spellCheck='false'
                variant='fill'
                pill
                {...inputProps}
                onChange={(e) => setMessageBody((e.target as any).value)}
                onEnterToSubmitForm={submitForm}
                disabled={!chatId || disabled}
                value={messageBody}
                ref={textAreaRef}
                rightElement={!sendButtonText ? renderSendButton : undefined}
              />
              {sendButtonText && (
                <Button
                  type='submit'
                  disabled={isDisabled}
                  size='lg'
                  onClick={submitForm}
                  {...sendButtonProps}
                >
                  {sendButtonText}
                </Button>
              )}
            </form>
          )
        }}
      </CaptchaInvisible>

      <EmailSubscribeModal chatId={chatId} />
      <SubsocialProfileModal
        title='🎩 What is your name?'
        isOpen={isOpenNameModal}
        closeModal={() => setIsOpenNameModal(false)}
        cancelButtonText='No, I want to stay anonymous'
      />
    </>
  )
}

const unsentMessageStorage = new LocalStorage(
  (chatId: string) => `unsent-message-${chatId}`
)

function useLoadUnsentMessage(chatId: string) {
  const setMessageBody = useMessageData((state) => state.setMessageBody)
  const setReplyTo = useMessageData((state) => state.setReplyTo)
  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )

  useEffect(() => {
    const unsentMessageData = unsentMessageStorage.get(chatId)
    if (!unsentMessageData) return
    const unsentMessage = JSON.parse(unsentMessageData) as SendMessageParams
    unsentMessageStorage.remove(chatId)

    setMessageBody(unsentMessage.message ?? '')
    setReplyTo(unsentMessage.replyTo ?? '')
    const firstExtension = unsentMessage.extensions?.[0]
    switch (firstExtension?.id) {
      case 'subsocial-image':
        openExtensionModal(firstExtension.id, firstExtension.properties.image)
        break
      case 'subsocial-decoded-promo':
        openExtensionModal(firstExtension.id, {
          recipient: firstExtension.properties.recipient,
          messageId: firstExtension.properties.message,
        })
        break
      case 'subsocial-evm-nft':
        openExtensionModal(firstExtension.id, firstExtension.properties.url)
        break
      case 'subsocial-donations':
        openExtensionModal(firstExtension.id, {
          recipient: firstExtension.properties.to,
          messageId: unsentMessage.replyTo ?? '',
        })
        break
    }
  }, [chatId, setMessageBody, setReplyTo, openExtensionModal])
}

function showErrorSendingMessageToast(
  error: unknown,
  errorTitle: string,
  message: SendMessageParams
) {
  unsentMessageStorage.set(JSON.stringify(message), message.chatId)

  showErrorToast(error, errorTitle, {
    toastConfig: { duration: Infinity },
    getDescription: message
      ? () => 'Click refresh to recover your message and try again'
      : undefined,
    actionButton: (t) => (
      <Button
        size='circle'
        variant='transparent'
        className='text-lg'
        onClick={() => {
          toast.dismiss(t.id)
          window.location.reload()
        }}
      >
        <IoRefresh />
      </Button>
    ),
  })
}
