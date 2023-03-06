import Send from '@/assets/icons/send.svg'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import { useSendMessage } from '@/services/subsocial/commentIds'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/className'
import { ComponentProps, useState } from 'react'
import CaptchaModal from './CaptchaModal'

export type ChatFormProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  postId: string
  spaceId: string
}

const ESTIMATED_ENERGY_FOR_ONE_TX = 300000000 // TODO: update based on chain

export default function ChatForm({
  className,
  postId,
  spaceId,
  ...props
}: ChatFormProps) {
  const isLoggedIn = useMyAccount(
    (state) =>
      !!state.address && (state.energy ?? 0) > ESTIMATED_ENERGY_FOR_ONE_TX
  )
  const [isOpenCaptcha, setIsOpenCaptcha] = useState(false)
  const [message, setMessage] = useState('')
  const { mutate: sendMessage } = useSendMessage()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (isLoggedIn) {
      sendMessage({ message, rootPostId: postId, spaceId })
      setMessage('')
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
        <Input
          value={message}
          onChange={(e) => setMessage((e.target as any).value)}
          placeholder='Message...'
          autoComplete='off'
          pill
          variant='fill'
          containerClassName='group'
          rightElement={(classNames) => (
            <Button
              type='submit'
              size='circle'
              variant='mutedOutline'
              className={cx(
                classNames,
                'group-hover:border-transparent group-hover:bg-background-primary group-hover:text-text',
                'group-focus-within:border-transparent group-focus-within:bg-background-primary group-focus-within:text-text '
              )}
            >
              <Send className='relative top-px h-4 w-4' />
            </Button>
          )}
        />
      </form>
      <CaptchaModal
        isOpen={isOpenCaptcha}
        closeModal={() => {
          setIsOpenCaptcha(false)
          setMessage('')
        }}
        message={message}
        rootPostId={postId}
        spaceId={spaceId}
      />
    </>
  )
}
