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
import { useMessageData } from '@/stores/message'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { copyToClipboard } from '@/utils/strings'
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

const CaptchaInvisible = dynamic(
  () => import('@/components/captcha/CaptchaInvisible'),
  {
    ssr: false,
  }
)

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  chatId: string
  onSubmit?: () => void
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
  const clearReplyTo = useMessageData((state) => state.clearReplyTo)

  const { data: chat } = getPostQuery.useQuery(chatId)
  const chatTitle = chat?.content?.title ?? ''

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
          variables.message,
          setMessageBody
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

  const setMessageBody = useMessageData((state) => state.setMessageBody)

  const { mutate: sendMessage } = useSendMessage({
    onError: (error, variables) => {
      showErrorSendingMessageToast(
        error,
        'Failed to send message',
        variables.message,
        setMessageBody
      )
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
    if (replyTo) textAreaRef.current?.focus()
  }, [replyTo])

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
    clearReplyTo?.()
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
      replyTo,
      ...additionalTxParams,
    }

    const { newMessageParams, txPrevented } =
      (await beforeMesageSend?.(sendMessageParams)) || {}

    if (txPrevented) return

    const messageParams = newMessageParams || sendMessageParams

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

    onSubmit?.()
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
    </>
  )
}

function showErrorSendingMessageToast(
  error: unknown,
  errorTitle: string,
  message: string | undefined,
  setMessageBody: (message: string) => void
) {
  showErrorToast(error, errorTitle, {
    withIcon: false,
    toastConfig: { duration: Infinity },
    additionalDescription: message
      ? () => (
          <span className='text-text'>
            Click refresh to recover your message to clipboard
          </span>
        )
      : undefined,
    actionButton: (t) => (
      <Button
        className='ml-2'
        size='circle'
        variant='transparent'
        onClick={() => {
          copyToClipboard(message ?? '')
          toast.dismiss(t.id)
          window.location.reload()
        }}
      >
        <IoRefresh />
      </Button>
    ),
  })
}
