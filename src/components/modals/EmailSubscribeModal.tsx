import { useConfigContext } from '@/contexts/ConfigContext'
import useToastError from '@/hooks/useToastError'
import { useSubscribeWithEmail } from '@/services/subsocial-offchain/mutation'
import { useMessageCount } from '@/stores/message'
import { LocalStorage } from '@/utils/storage'
import { FormEventHandler, useEffect, useState } from 'react'
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

  const [email, setEmail] = useState('')
  const { mutate: subscribeWithEmail, error } = useSubscribeWithEmail({
    onSuccess: () => {
      setIsOpen(false)
      subscribedStorage.set('true')
    },
  })
  useToastError(error, 'Failed to subscribe to chat')

  const messageCount = useMessageCount()

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

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
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
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type='submit' size='lg' className='mt-6' disabled={!email}>
          Subscribe
        </Button>
      </form>
    </Modal>
  )
}
