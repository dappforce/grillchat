import Send from '@/assets/icons/send.svg'
import Button, { ButtonProps, buttonStyles } from '@/components/Button'
import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import TextArea, { TextAreaProps } from '@/components/inputs/TextArea'
import EmailSubscribeModal from '@/components/modals/EmailSubscribeModal'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/subsocial'
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
import { isTouchDevice } from '@/utils/device'
import {
  ComponentProps,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  chatId: string
  onSubmit?: () => void
  replyTo?: string
  clearReplyTo?: () => void
  disabled?: boolean
  inputProps?: TextAreaProps
  getAdditionalTxParams?: () => SendMessageParams
  sendButtonText?: string
  sendButtonProps?: ButtonProps
}

function processMessage(message: string) {
  return message.trim()
}

export default function ChatForm({
  className,
  chatId,
  onSubmit,
  disabled,
  replyTo,
  clearReplyTo,
  inputProps,
  getAdditionalTxParams,
  sendButtonText,
  sendButtonProps,
  ...props
}: ChatFormProps) {
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

  const [messageBody, setMessageBody] = useState('')
  const { mutate: sendMessage, error } = useSendMessage()
  useToastError(error, 'Message failed to send, please try again')

  const { enableInputAutofocus } = useConfigContext()
  useEffect(() => {
    if (enableInputAutofocus === true) textAreaRef.current?.focus()
    else if (enableInputAutofocus === undefined) {
      if (isTouchDevice()) return
      textAreaRef.current?.focus()
    }
  }, [enableInputAutofocus])
  useEffect(() => {
    if (replyTo) textAreaRef.current?.focus()
  }, [replyTo])

  useEffect(() => {
    setIsRequestingEnergy(false)
  }, [hasEnoughEnergy])

  const shouldSendMessage =
    isRequestingEnergy || (isLoggedIn && hasEnoughEnergy)
  const isDisabled = !processMessage(messageBody)

  const resetForm = () => {
    setMessageBody('')
    clearReplyTo?.()
  }
  const handleSubmit = (captchaToken: string | null, e?: SyntheticEvent) => {
    e?.preventDefault()
    if (
      shouldSendMessage &&
      'virtualKeyboard' in navigator &&
      typeof (navigator.virtualKeyboard as any).show === 'function'
    ) {
      ;(navigator.virtualKeyboard as any).show()
    }

    const processedMessage = processMessage(messageBody)
    if (isDisabled) return

    const sendMessageParams = {
      message: processedMessage,
      chatId,
      replyTo,
      ...getAdditionalTxParams?.(),
    }
    if (shouldSendMessage) {
      resetForm()
      sendMessage(sendMessageParams)
    } else {
      if (isLoggedIn) {
        sendEvent('request energy')
      } else {
        sendEvent('send first message', { chatId, name: chatTitle })
      }
      if (!captchaToken) return
      resetForm()
      requestTokenAndSendMessage({
        captchaToken,
        ...sendMessageParams,
      })
      setIsRequestingEnergy(true)
      sendEvent('request energy and send message')
    }

    onSubmit?.()
    incrementMessageCount()
  }

  return (
    <>
      <CaptchaInvisible>
        {(runCaptcha) => {
          const submitForm = async (e?: SyntheticEvent) => {
            if (shouldSendMessage) {
              handleSubmit(null, e)
              return
            }
            const token = await runCaptcha()
            handleSubmit(token, e)
          }

          const renderSendButton = (classNames: string) => (
            <div
              onTouchEnd={(e) => {
                if (shouldSendMessage) {
                  e.preventDefault()
                  submitForm()
                }
              }}
              onClick={submitForm}
              className={cx(
                buttonStyles({
                  size: 'circle',
                  variant: isDisabled ? 'mutedOutline' : 'primary',
                }),
                classNames,
                'cursor-pointer',
                sendButtonProps?.className
              )}
            >
              <Send className='relative top-px h-4 w-4' />
            </div>
          )

          return (
            <form
              onSubmit={submitForm}
              {...props}
              className={cx('flex w-full flex-col gap-2', className)}
            >
              <TextArea
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
