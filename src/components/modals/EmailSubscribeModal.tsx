import { useConfigContext } from '@/contexts/ConfigContext'
import usePrevious from '@/hooks/usePrevious'
import { useMessageCount } from '@/stores/message'
import { useEffect, useState } from 'react'
import Modal from './Modal'

export default function EmailSubscribeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { subscribeMessageCountThreshold } = useConfigContext()

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

  return (
    <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
      <div>asdfasdf</div>
    </Modal>
  )
}
