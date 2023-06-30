import InfoPanel from '@/components/InfoPanel'
import Name from '@/components/Name'
import { useMyAccount } from '@/stores/my-account'
import { useEffect, useState } from 'react'
import CommonChatItem from '../CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getMessageExtensionProperties } from '../utils'
import { decodeSecretBox } from './utils'

export default function SecretBoxChatItem(props: ExtensionChatItemProps) {
  const [decryptedMessage, setDecryptedMessage] = useState<string>()
  const myAddress = useMyAccount((state) => state.address)

  const { message } = props
  const { content } = message
  const { extensions } = content || {}

  const decodedPromoProperties = getMessageExtensionProperties(
    extensions?.[0],
    'subsocial-decoded-promo'
  )

  const {
    message: encryptedMessage,
    recipient,
    nonce,
  } = decodedPromoProperties || {}

  useEffect(() => {
    console.log(encryptedMessage, nonce, myAddress, recipient)
    if (!encryptedMessage || !nonce || myAddress !== recipient) return

    const decryptMessage = async () => {
      const newMessage = await decodeSecretBox(encryptedMessage, nonce)

      setDecryptedMessage(newMessage)
    }

    decryptMessage()
  }, [!!decodedPromoProperties])

  return (
    <CommonChatItem {...props}>
      {() => (
        <InfoPanel variant='info'>
          {decryptedMessage ? (
            decryptedMessage
          ) : (
            <>
              📦 Only <Name address={recipient || ''} /> is able to read this
              secret message.
            </>
          )}
        </InfoPanel>
      )}
    </CommonChatItem>
  )
}
