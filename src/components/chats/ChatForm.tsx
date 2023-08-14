import Send from '@/assets/icons/send.svg'
import Button, { ButtonProps } from '@/components/Button'
import TextArea, { TextAreaProps } from '@/components/inputs/TextArea'
import EmailSubscribeModal from '@/components/modals/EmailSubscribeModal'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
import useAutofocus from '@/hooks/useAutofocus'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import useRequestTokenAndSendMessage from '@/hooks/useRequestTokenAndSendMessage'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
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
import PopOver from '../floating/PopOver'
import Toast from '../Toast'

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
  const networkStatus = useNetworkStatus()

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

  const {
    mutateAsync: requestTokenAndSendMessage,
    error: errorRequestTokenAndSendMessage,
  } = useRequestTokenAndSendMessage()
  useToastError<ApiRequestTokenResponse>(
    errorRequestTokenAndSendMessage,
    'Create account failed',
    (e) => e.message
  )

  let messageBody = useMessageData((state) => state.messageBody)
  const showEmptyPrimaryChatInput = useMessageData(
    (state) => state.showEmptyPrimaryChatInput
  )
  if (isPrimary && showEmptyPrimaryChatInput) {
    messageBody = ''
  }

  const setMessageBody = useMessageData((state) => state.setMessageBody)

  const { mutate: sendMessage, error } = useSendMessage()
  useToastError(error, 'Message failed to send, please try again')

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

  const isNetworkConnected = networkStatus === 'connected'
  const isDisabled =
    !isNetworkConnected ||
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

    if (!isNetworkConnected) {
      toast.custom((t) => (
        <Toast
          t={t}
          title='Network is reconnecting'
          description='Please try again later, or refresh the page'
          action={
            <Button
              size='circle'
              className='ml-2'
              onClick={() => window.location.reload()}
            >
              <IoRefresh />
            </Button>
          }
        />
      ))
    }

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

    // TODO: wrap it into hook
    const isFirstMessageInSession = sessionStorage.getItem('FIRST_MESSAGE_SENT')
    if (isFirstMessageInSession) {
      sendEvent('send_first_message', { chatId, title: chatTitle })
      sessionStorage.setItem('FIRST_MESSAGE_SENT', 'true')
    }

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

          const renderSendButton = (classNames: string) => {
            const sendButton = (
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
                className={cx(
                  isNetworkConnected && classNames,
                  sendButtonProps?.className
                )}
              >
                <Send className='relative top-px h-4 w-4' />
              </Button>
            )

            if (isNetworkConnected) return sendButton
            return (
              <PopOver
                triggerOnHover
                yOffset={8}
                triggerClassName={classNames}
                trigger={sendButton}
                placement='top-end'
                panelSize='sm'
              >
                <p>Network connecting...</p>
              </PopOver>
            )
          }

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
