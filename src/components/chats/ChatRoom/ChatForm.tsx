import Send from '@/assets/icons/send.svg'
import { buttonStyles } from '@/components/Button'
import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import TextArea from '@/components/inputs/TextArea'
import { ESTIMATED_ENERGY_FOR_ONE_TX } from '@/constants/chat'
import { useConfigContext } from '@/contexts/ConfigContext'
import useRequestTokenAndSendMessage from '@/hooks/useRequestTokenAndSendMessage'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { getPostQuery } from '@/services/api/query'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useSendEvent } from '@/stores/analytics'
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
}

function processMessage(message: string) {
  return message.trim()
}

export default function ChatForm({
  className,
  chatId,
  onSubmit,
  replyTo,
  clearReplyTo,
  ...props
}: ChatFormProps) {
  const { data: chat } = getPostQuery.useQuery(chatId)
  const chatTitle = chat?.content?.title ?? ''

  const sendEvent = useSendEvent()

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

  const { inputAutofocus } = useConfigContext()
  useEffect(() => {
    if (inputAutofocus === true) textAreaRef.current?.focus()
    else if (inputAutofocus === undefined) {
      if (isTouchDevice()) return
      textAreaRef.current?.focus()
    }
  }, [inputAutofocus])
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

    if (shouldSendMessage) {
      resetForm()
      sendMessage({
        message: processedMessage,
        chatId: chatId,
        replyTo,
      })
    } else {
      if (isLoggedIn) {
        sendEvent('request energy')
      } else {
        sendEvent('send first message', { chatId: chatId, name: chatTitle })
      }
      if (!captchaToken) return
      resetForm()
      requestTokenAndSendMessage({
        captchaToken,
        message: processMessage(messageBody),
        chatId: chatId,
        replyTo,
      })
      setIsRequestingEnergy(true)
      sendEvent('request energy and send message')
    }

    onSubmit?.()
  }

  return (
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

        return (
          <form
            onSubmit={submitForm}
            {...props}
            className={cx('flex w-full', className)}
          >
            <TextArea
              onEnterToSubmitForm={submitForm}
              ref={textAreaRef}
              value={messageBody}
              onChange={(e) => setMessageBody((e.target as any).value)}
              placeholder='Message...'
              rows={1}
              autoComplete='off'
              autoCapitalize='sentences'
              autoCorrect='off'
              spellCheck='false'
              variant='fill'
              pill
              rightElement={(classNames) => (
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
                    'cursor-pointer'
                  )}
                >
                  <Send className='relative top-px h-4 w-4' />
                </div>
              )}
            />
          </form>
        )
      }}
    </CaptchaInvisible>
  )
}
