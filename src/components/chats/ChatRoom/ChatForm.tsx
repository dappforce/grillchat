import Send from '@/assets/icons/send.svg'
import { buttonStyles } from '@/components/Button'
import CaptchaInvisible from '@/components/captcha/CaptchaInvisible'
import TextArea from '@/components/inputs/TextArea'
import Toast from '@/components/Toast'
import useRequestTokenAndSendMessage from '@/hooks/useRequestTokenAndSendMessage'
import useToastError from '@/hooks/useToastError'
import { ApiRequestTokenResponse } from '@/pages/api/request-token'
import { getPostQuery } from '@/services/api/query'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import {
  ComponentProps,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { toast } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  postId: string
  spaceId: string
  onSubmit?: () => void
}

const ESTIMATED_ENERGY_FOR_ONE_TX = 100_000_000

function processMessage(message: string) {
  return message.trim()
}

export default function ChatForm({
  className,
  postId,
  spaceId,
  onSubmit,
  ...props
}: ChatFormProps) {
  const { data: post } = getPostQuery.useQuery(postId)
  const topicName = post?.content?.title ?? ''

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
    (e) => e.message
  )

  const [message, setMessage] = useState('')
  const { mutate: sendMessage, error } = useSendMessage()

  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  useEffect(() => {
    setIsRequestingEnergy(false)
  }, [hasEnoughEnergy])

  useEffect(() => {
    if (error) {
      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => <IoWarningOutline className={classNames} />}
          title='Message failed to send, please try again'
          description={error?.message}
        />
      ))
      setIsRequestingEnergy(false)
    }
  }, [error])

  const shouldSendMessage =
    isRequestingEnergy || (isLoggedIn && hasEnoughEnergy)
  const isDisabled = !processMessage(message)

  const handleSubmit = (captchaToken: string | null, e?: SyntheticEvent) => {
    console.log(captchaToken, shouldSendMessage)
    e?.preventDefault()
    if (
      shouldSendMessage &&
      'virtualKeyboard' in navigator &&
      typeof (navigator.virtualKeyboard as any).show === 'function'
    ) {
      ;(navigator.virtualKeyboard as any).show()
    }

    const processedMessage = processMessage(message)
    if (isDisabled) return

    if (shouldSendMessage) {
      setMessage('')
      sendMessage({ message: processedMessage, rootPostId: postId, spaceId })
      onSubmit?.()
    } else {
      if (isLoggedIn) {
        sendEvent('request energy')
      } else {
        sendEvent('send first message', { chatId: postId, name: topicName })
      }
      if (!captchaToken) return
      setMessage('')
      requestTokenAndSendMessage({
        captchaToken,
        message: processMessage(message),
        rootPostId: postId,
        spaceId,
      })
      setIsRequestingEnergy(true)
      sendEvent('request energy and send message')
    }
  }

  return (
    <CaptchaInvisible>
      {(runCaptcha) => {
        const onSubmit = async (e?: SyntheticEvent) => {
          console.log('masuk', shouldSendMessage)
          if (shouldSendMessage) {
            handleSubmit(null, e)
            return
          }
          console.log('requesting token')
          const token = await runCaptcha()
          console.log('done requesting token')
          handleSubmit(token, e)
        }

        return (
          <form
            onSubmit={onSubmit}
            {...props}
            className={cx('flex w-full', className)}
          >
            <TextArea
              onEnterToSubmitForm={onSubmit}
              ref={textAreaRef}
              value={message}
              autoFocus
              onChange={(e) => setMessage((e.target as any).value)}
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
                      onSubmit()
                    }
                  }}
                  onClick={onSubmit}
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
