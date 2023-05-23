import { useConfigContext } from '@/contexts/ConfigContext'
import useToastError from '@/hooks/useToastError'
import { useSubscribeWithEmail } from '@/services/subsocial-offchain/mutation'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { validateEmail } from '@/utils/strings'
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from 'react'
import Button from '../Button'
import Input from '../inputs/Input'
import Modal from './Modal'

export type EmailSubscribeModalProps = {
  hubId: string
  chatId: string
}

const SUBSCRIBED_STORAGE_KEY = 'email_subscribed'
const subscribedStorage = new LocalStorage(() => SUBSCRIBED_STORAGE_KEY)

export default function EmailSubscribeModal({
  chatId,
  hubId,
}: EmailSubscribeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { subscribeMessageCountThreshold } = useConfigContext()

  // if form becomes more complex, use third-party libraries to manage form states.
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const {
    mutate: subscribeWithEmail,
    error,
    isLoading,
  } = useSubscribeWithEmail({
    onSuccess: () => {
      setIsOpen(false)
      subscribedStorage.set('true')
    },
  })
  useToastError(error, 'Failed to subscribe to chat')

  const messageCount = useMessageData((state) => state.messageCount)

  useEffect(() => {
    const isSubscribed = subscribedStorage.get() === 'true'
    const isValidThreshold =
      subscribeMessageCountThreshold && subscribeMessageCountThreshold > 0

    if (
      !isSubscribed &&
      messageCount &&
      isValidThreshold &&
      messageCount > subscribeMessageCountThreshold
    ) {
      setIsOpen(true)
    }
  }, [messageCount, subscribeMessageCountThreshold])

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const email = e.target.value
    setEmail(email)

    const isValidEmail = validateEmail(email)
    if (!isValidEmail) {
      setEmailError('Invalid email')
    } else {
      setEmailError('')
    }
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (!email) {
      setEmailError('Email is required')
      return
    }

    subscribeWithEmail({ email, chatId, hubId })
  }

  return (
    <Modal
      isOpen={isOpen}
      // make modal closable only by subscribing
      closeModal={() => {}}
      size='full-screen'
      containerClassName='p-0'
      panelClassName='rounded-none flex items-center justify-center'
      contentClassName={cx(
        'min-h-screen flex flex-col justify-center items-center py-8 max-w-xl'
      )}
    >
      <h1
        className='bg-gradient-to-b from-[#E4B7EC] to-[#806EF8] bg-clip-text text-center text-4.5xl font-bold leading-none'
        style={{ WebkitTextFillColor: 'transparent' }}
      >
        Get free unlimited access
      </h1>
      <p className='mt-4 text-center text-2xl text-text-muted'>
        to the chat when you sign up for our newsletter
      </p>
      <form className='mt-8 flex w-full flex-col' onSubmit={onSubmit}>
        <Input
          placeholder='Your email address'
          value={email}
          onChange={onEmailChange}
          error={emailError}
        />
        <Button
          type='submit'
          size='lg'
          className='mt-4'
          disabled={!email || !!emailError}
          isLoading={isLoading}
        >
          Sign Up & Continue Chatting
        </Button>
      </form>
      <ul className='mt-8 w-full list-inside list-disc text-text-muted'>
        <li>Unsubscribe at any time</li>
        <li>No spam or shilling</li>
        <li>Will not sell your data</li>
      </ul>
    </Modal>
  )
}
