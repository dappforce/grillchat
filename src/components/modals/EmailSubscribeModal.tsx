import { useConfigContext } from '@/contexts/ConfigContext'
import useToastError from '@/hooks/useToastError'
import { useSubscribeWithEmail } from '@/services/subsocial-offchain/mutation'
import { useMessageData } from '@/stores/message'
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
      title='Subscribe to Grill.chat'
      description="Don't miss any new updates happening in Grill.chat!"
      isOpen={isOpen}
      // make modal closable only by subscribing
      closeModal={() => {}}
    >
      <form className='flex flex-col' onSubmit={onSubmit}>
        <Input
          containerClassName='mt-2'
          label='Your email'
          placeholder='abc@xyz.com'
          value={email}
          onChange={onEmailChange}
          error={emailError}
        />
        <Button
          type='submit'
          size='lg'
          className='mt-6'
          disabled={!email || !!emailError}
          isLoading={isLoading}
        >
          Subscribe
        </Button>
      </form>
    </Modal>
  )
}
