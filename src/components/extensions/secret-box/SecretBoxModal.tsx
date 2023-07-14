import InfoPanel from '@/components/InfoPanel'
import TextArea from '@/components/inputs/TextArea'
import ProfilePreview from '@/components/ProfilePreview'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { useExtensionModalState } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import { ExtensionModalsProps } from '..'
import CommonExtensionModal from '../CommonExtensionModal'
import { useEncodeSecretBox } from './utils'

export default function SecretBoxModal(props: ExtensionModalsProps) {
  const { closeModal, isOpen, initialData } = useExtensionModalState(
    'subsocial-decoded-promo'
  )
  const address = useMyAccount((state) => state.address)

  const [secretMessage, setSecretMessage] = useState('')
  const { mutateAsync: encodeSecretBox } = useEncodeSecretBox()

  const [recipient, setRecipient] = useState('')
  const { recipient: initialRecipient, messageId } = initialData
  useEffect(() => {
    if (initialRecipient) {
      setRecipient(initialRecipient)
      setSecretMessage('')
    }
  }, [initialRecipient])

  const setReplyTo = useMessageData((state) => state.setReplyTo)
  useEffect(() => {
    if (isOpen) setReplyTo(messageId)
  }, [setReplyTo, messageId, isOpen])

  const beforeMesageSend = async (messageParams: SendMessageParams) => {
    if (!address) return { txPrevented: true }

    const encryptedMessageData = await encodeSecretBox({
      message: secretMessage,
      address,
    })

    const { encyptedMessage, nonce } = encryptedMessageData || {}

    if (!encyptedMessage || !nonce) return { txPrevented: true }

    const newMessageParams: SendMessageParams = {
      ...messageParams,
      extensions: [
        {
          id: 'subsocial-decoded-promo' as const,
          properties: {
            message: encyptedMessage,
            recipient,
            nonce,
          },
        },
      ],
    }

    return { newMessageParams, txPrevented: false }
  }

  return (
    <CommonExtensionModal
      {...props}
      title='📦 Secret Box'
      mustHaveMessageBody={false}
      disableSendButton={!secretMessage}
      isOpen={isOpen}
      autofocus={false}
      closeModal={closeModal}
      beforeMesageSend={beforeMesageSend}
    >
      <div className='flex flex-col gap-4'>
        <div>
          <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-text-muted'>
            Recipient
          </div>
          <div className={cx('mt-2 rounded-2xl bg-background-lighter p-4')}>
            <ProfilePreview address={recipient} avatarClassName='h-12 w-12' />
          </div>
        </div>

        <div>
          <div className='mb-2 flex justify-between text-sm font-normal leading-4 text-text-muted'>
            Secret Message
          </div>
          <TextArea
            value={secretMessage}
            onChange={(e) => setSecretMessage(e.target.value)}
            rows={3}
            size='sm'
            placeholder='Secret message for the recipient'
            variant='fill-bg'
          />
        </div>

        <InfoPanel variant='info'>
          ℹ️ Only the recipient will be able to read this secret message.
        </InfoPanel>
      </div>
    </CommonExtensionModal>
  )
}
