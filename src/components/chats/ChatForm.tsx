import Send from '@/assets/icons/send.svg'
import Button, { ButtonProps } from '@/components/Button'
import TextArea, { TextAreaProps } from '@/components/inputs/TextArea'
import { ERRORS } from '@/constants/error'
import { env } from '@/env.mjs'
import useAutofocus from '@/hooks/useAutofocus'
import useLoginOption from '@/hooks/useLoginOption'
import useRequestTokenAndSendMessage from '@/hooks/useRequestTokenAndSendMessage'
import { showErrorToast } from '@/hooks/useToastError'
import { useConfigContext } from '@/providers/config/ConfigProvider'
import { getPostQuery, getServerTime } from '@/services/api/query'
import { apiInstance } from '@/services/api/utils'
import { useSendOffchainMessage } from '@/services/datahub/posts/mutation'
import {
  SendMessageParams,
  useSendMessage,
} from '@/services/subsocial/commentIds'
import { useSendEvent } from '@/stores/analytics'
import { useExtensionData } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import {
  getHasEnoughEnergy,
  hasSentMessageStorage,
  useMyAccount,
  useMyMainAddress,
} from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import {
  ComponentProps,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import { useHotkeys } from 'react-hotkeys-hook'
import { IoRefresh } from 'react-icons/io5'
import { BeforeMessageResult } from '../extensions/common/CommonExtensionModal'
import { interceptPastedData } from '../extensions/config'
import { sendEventWithRef } from '../referral/analytics'

// const StayUpdatedModal = dynamic(() => import('./StayUpdatedModal'), {
//   ssr: false,
// })

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
  const myAddress = useMyMainAddress()
  const replyTo = useMessageData((state) => state.replyTo)
  const messageToEdit = useMessageData((state) => state.messageToEdit)
  const clearAction = useMessageData((state) => state.clearAction)
  const setMessageBody = useMessageData((state) => state.setMessageBody)

  useHotkeys('esc', clearAction, {
    keydown: true,
    enableOnFormTags: ['TEXTAREA'],
  })

  const { data: editedMessage } = getPostQuery.useQuery(messageToEdit, {
    enabled: !!messageToEdit,
  })
  const editedMessageBody = editedMessage?.content?.body
  useEffect(() => {
    if (!editedMessageBody) return
    setMessageBody(editedMessageBody)
  }, [editedMessageBody, setMessageBody])

  const [isDisabledInput, setIsDisabledInput] = useState(false)
  const reloadUnsentMessage = useLoadUnsentMessage(chatId)

  const [isOpenCtaModal, setIsOpenCtaModal] = useState(false)

  const sendEvent = useSendEvent()
  const incrementMessageCount = useMessageData(
    (state) => state.incrementMessageCount
  )

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const hasEnoughEnergy = useMyAccount((state) =>
    getHasEnoughEnergy(state.energy)
  )
  const [isRequestingEnergy, setIsRequestingEnergy] = useState(false)

  const { mutate: requestTokenAndSendMessage } = useRequestTokenAndSendMessage({
    onSuccess: () => unsentMessageStorage.remove(chatId),
    onError: (error, variables) => {
      showErrorSendingMessageToast(error, 'Failed to send message', variables, {
        reloadUnsentMessage,
        setIsDisabledInput,
      })
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
    onSuccess: () => unsentMessageStorage.remove(chatId),
    onError: (error, variables) => {
      showErrorSendingMessageToast(error, 'Failed to send message', variables, {
        reloadUnsentMessage,
        setIsDisabledInput,
      })
    },
  })
  const { mutate: sendOffchainMessage } = useSendOffchainMessage({
    onSuccess: () => unsentMessageStorage.remove(chatId),
    onError: (error, variables) => {
      showErrorSendingMessageToast(error, 'Failed to send message', variables, {
        reloadUnsentMessage,
        setIsDisabledInput,
      })
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
    isLoggedIn && (isRequestingEnergy || hasEnoughEnergy)

  const isDisabled =
    (mustHaveMessageBody && !processMessage(messageBody)) ||
    sendButtonProps?.disabled ||
    isDisabledInput

  const resetForm = () => {
    setMessageBody('')
    clearAction?.()
  }

  const handleSubmit = async () => {
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

    const willOpenLoginModal = !isLoggedIn
    if (!hasSentMessageStorage.get() && !willOpenLoginModal) {
      setTimeout(() => {
        setIsOpenCtaModal(true)
      }, 2000)
    }

    unsentMessageStorage.set(JSON.stringify(messageParams), chatId)
    hasSentMessageStorage.set('true')

    resetForm()
    const isOffchainPosting =
      env.NEXT_PUBLIC_OFFCHAIN_POSTING_HUBS.includes(hubId)
    if (isOffchainPosting) {
      try {
        const serverTime = await getServerTime()
        sendOffchainMessage({
          ...messageParams,
          uuid: crypto.randomUUID(),
          timestamp: serverTime,
        })
      } catch (err) {
        showErrorSendingMessageToast(
          err,
          'Failed to get server time',
          messageParams,
          {
            reloadUnsentMessage,
            setIsDisabledInput,
          }
        )
      }
    } else if (shouldSendMessage) {
      sendMessage(messageParams)
    } else {
      requestTokenAndSendMessage(messageParams)
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
    sendEventWithRef(myAddress ?? '', (ref) => {
      sendEvent('send_comment', { extensionType: firstExtension?.id }, { ref })
    })

    onSubmit?.(!!messageParams.messageIdToEdit)
    incrementMessageCount()
  }

  const { promptUserForLogin } = useLoginOption()
  const submitForm = async (e?: SyntheticEvent) => {
    e?.preventDefault()
    if (!myAddress) {
      promptUserForLogin()
      return
    }

    handleSubmit()
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
    <>
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

      {/* <StayUpdatedModal
        isOpen={isOpenCtaModal}
        closeModal={() => setIsOpenCtaModal(false)}
      /> */}
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

  const loadUnsentMessage = useCallback(() => {
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

  useEffect(() => {
    loadUnsentMessage()
  }, [loadUnsentMessage])

  return loadUnsentMessage
}

function showErrorSendingMessageToast(
  error: unknown,
  errorTitle: string,
  message: SendMessageParams,
  additionalConfig?: {
    reloadUnsentMessage?: () => void
    setIsDisabledInput?: (disabled: boolean) => void
  }
) {
  unsentMessageStorage.set(JSON.stringify(message), message.chatId)

  const errorData = (error as any)?.response?.data?.errors
  const isRateLimited = errorData?.name === ERRORS.RATE_LIMIT_EXCEEDED
  const isMessagePermissionDenied =
    errorData?.name === ERRORS.CREATE_MESSAGE_PERMISSION_DENIED

  let title = errorTitle
  if (isRateLimited) {
    const { reloadUnsentMessage, setIsDisabledInput } = additionalConfig || {}
    title = 'Please try again in a moment'
    reloadUnsentMessage?.()

    const remainingSeconds = errorData?.remainingSeconds
    if (setIsDisabledInput && remainingSeconds) {
      setIsDisabledInput?.(true)
      setTimeout(() => {
        setIsDisabledInput(false)
      }, remainingSeconds * 1000)
    }
  }

  apiInstance.post('/api/logger', { error: error + '' }).catch(console.error)

  showErrorToast(error, title, {
    toastConfig: { duration: isRateLimited ? 5000 : Infinity },
    getDescription:
      message && !isRateLimited && !isMessagePermissionDenied
        ? () => 'Click refresh to recover your message and try again'
        : undefined,
    actionButton:
      isRateLimited || isMessagePermissionDenied
        ? undefined
        : (t) => (
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
