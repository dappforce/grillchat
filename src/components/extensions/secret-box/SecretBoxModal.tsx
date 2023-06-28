import InfoPanel from '@/components/InfoPanel'
import TextArea from '@/components/inputs/TextArea'
import ProfilePreview from '@/components/ProfilePreview'
import useGetNonce from '@/hooks/useGetNonce'
import { useExtensionModalState } from '@/stores/extension'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import { ExtensionModalsProps } from '..'
import CommonExtensionModal from '../CommonExtensionModal'
import { encodeSecretBox } from './utils'

export default function SecretBoxModal(props: ExtensionModalsProps) {
  const { closeModal, isOpen, initialData } = useExtensionModalState(
    'subsocial-secret-box'
  )
  const getNonce = useGetNonce()
  const encodedSecretKey = useMyAccount((state) => state.encodedSecretKey)

  const [secretMessage, setSecretMessage] = useState('')

  const [recipient, setRecipient] = useState('')
  const initialRecipient = initialData.recipient
  useEffect(() => {
    if (initialRecipient) setRecipient(initialRecipient)
  }, [initialRecipient])

  const buildAdditionalTxParams = async () => {
    const nonce = await getNonce()
    if (nonce === null || !encodedSecretKey) return {}

    const encryptedMessage = await encodeSecretBox(
      secretMessage,
      encodedSecretKey,
      recipient,
      nonce
    )

    return {
      extensions: [
        {
          id: 'subsocial-secret-box' as const,
          properties: {
            message: encryptedMessage,
            recipient,
            nonce,
          },
        },
      ],
    }
  }

  return (
    <CommonExtensionModal
      {...props}
      title='📦 Secret Box'
      mustHaveMessageBody={false}
      disableSendButton={!secretMessage}
      isOpen={isOpen}
      closeModal={closeModal}
      buildAdditionalTxParams={buildAdditionalTxParams}
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
            placeholder='Secret message for recipient'
            className='bg-background'
          />
        </div>

        <InfoPanel variant='info'>
          ℹ️ Only the recipient will be able to read this secret message.
        </InfoPanel>
      </div>
    </CommonExtensionModal>
  )
}
