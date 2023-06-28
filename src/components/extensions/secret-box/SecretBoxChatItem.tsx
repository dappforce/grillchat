import InfoPanel from '@/components/InfoPanel'
import CommonChatItem from '../CommonChatItem'
import { ExtensionChatItemProps } from '../types'

export default function SecretBoxChatItem(props: ExtensionChatItemProps) {
  return (
    <CommonChatItem {...props}>
      {() => (
        <InfoPanel variant='info'>
          {/* TODO: SECRET BOX: update this text and enable decryption */}
          📦 Only Silky Flyingfish is able to read this secret message.
        </InfoPanel>
      )}
    </CommonChatItem>
  )
}
