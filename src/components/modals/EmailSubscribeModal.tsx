import { useConfigContext } from '@/contexts/ConfigContext'
import usePrevious from '@/hooks/usePrevious'
import { getPostQuery } from '@/services/api/query'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { useMessageCount } from '@/stores/message'
import { FormEventHandler, useEffect, useState } from 'react'
import Button from '../Button'
import Input from '../inputs/Input'
import Modal from './Modal'

export type EmailSubscribeModalProps = {
  hubId: string
  chatId: string
}

export default function EmailSubscribeModal({
  chatId,
  hubId,
}: EmailSubscribeModalProps) {
  const { data: hub } = getSpaceBySpaceIdQuery.useQuery(hubId)
  const { data: chat } = getPostQuery.useQuery(chatId)

  const [isOpen, setIsOpen] = useState(true)
  const { subscribeMessageCountThreshold } = useConfigContext()

  const [email, setEmail] = useState('')

  const messageCount = useMessageCount()
  const prevMessageCount = usePrevious(messageCount)

  useEffect(() => {
    const isUsingSubscribeMessageCount =
      subscribeMessageCountThreshold && subscribeMessageCountThreshold > 0
    if (
      messageCount &&
      prevMessageCount &&
      isUsingSubscribeMessageCount &&
      messageCount > subscribeMessageCountThreshold
    ) {
      setIsOpen(true)
    }
  }, [prevMessageCount, messageCount, subscribeMessageCountThreshold])

  const chatTitle = chat?.content?.title ?? chatId
  const hubTitle = hub?.content?.name ?? hubId

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }

  return (
    <Modal
      title={`Subscribe to ${chatTitle}`}
      description={`Don't miss any new messages in ${chatTitle} in ${hubTitle}!`}
      isOpen={isOpen}
      closeModal={() => setIsOpen(false)}
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
