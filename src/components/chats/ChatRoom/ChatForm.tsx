import Send from '@/assets/icons/send.svg'
import { buttonStyles } from '@/components/Button'
import TextArea from '@/components/inputs/TextArea'
import Toast from '@/components/Toast'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'
import CaptchaModal from './CaptchaModal'

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
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const hasEnoughEnergy = useMyAccount(
    (state) => (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
  )
  const [isRequestingEnergy, setIsRequestingEnergy] = useState(false)

  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)
  const [message, setMessage] = useState('')
  const { mutate: sendMessage, error } = useSendMessage()

  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  useEffect(() => {
    setIsRequestingEnergy(false)
  }, [hasEnoughEnergy])

  useEffect(() => {
    if (error)
      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => <IoWarningOutline className={classNames} />}
          title='Sending message failed. Please try again'
          description={error?.message}
        />
      ))
  }, [error])

  const shouldSendMessage =
    isRequestingEnergy || (isLoggedIn && hasEnoughEnergy)
  const isDisabled = !processMessage(message)

  const handleSubmit = (e?: any) => {
    e.preventDefault()
    if (shouldSendMessage && 'virtualKeyboard' in navigator) {
      ;(navigator.virtualKeyboard as any).show()
    }

    alert(`submit ${isDisabled} ${shouldSendMessage}`)
    const processedMessage = processMessage(message)
    if (isDisabled) return

    if (shouldSendMessage) {
      setMessage('')
      sendMessage({ message: processedMessage, rootPostId: postId, spaceId })
      onSubmit?.()
    } else {
      setIsOpenCaptcha(true)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        {...props}
        className={cx('flex w-full', className)}
      >
        <TextArea
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
                  textAreaRef.current?.focus()
                  handleSubmit()
                }
              }}
              onClick={handleSubmit}
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
      <CaptchaModal
        onSubmit={() => {
          onSubmit?.()
          setMessage('')
          setIsRequestingEnergy(true)
        }}
        isOpen={isOpenCaptcha}
        closeModal={() => setIsOpenCaptcha(false)}
        message={processMessage(message)}
        rootPostId={postId}
        spaceId={spaceId}
      />
    </>
  )
}
