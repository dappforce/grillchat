import InfoPanel from '@/components/InfoPanel'
import Name from '@/components/Name'
import useGetTheme from '@/hooks/useGetTheme'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import CommonChatItem from '../CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getMessageExtensionProperties } from '../utils'
import { useDecodeSecretBox } from './utils'

export default function SecretBoxChatItem(props: ExtensionChatItemProps) {
  const [decryptedMessage, setDecryptedMessage] = useState<string>()
  const myAddress = useMyAccount((state) => state.address)
  const theme = useGetTheme()
  const { mutateAsync: decodeSecretBox } = useDecodeSecretBox()

  const { message, isMyMessage } = props
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
    if (!encryptedMessage || !nonce || myAddress !== recipient) return

    const decryptMessage = async () => {
      const newMessage = await decodeSecretBox({ encryptedMessage, nonce })

      setDecryptedMessage(newMessage)
    }

    decryptMessage()
  }, [!!decodedPromoProperties, myAddress])

  // TODO: Create css file with styles for extensions
  const darkThemeStyles = isMyMessage
    ? 'bg-[#6660DF] text-white'
    : 'bg-[#3B82F6]/10 text-[#60A5FA]'

  const lightThemeStyles = isMyMessage
    ? 'bg-[#E0E7FF] text-black'
    : 'bg-[#EEF2FF] text-black'

  const darkThemeTextColor = isMyMessage ? '#FFF' : '#60A5FA'

  return (
    <CommonChatItem
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      {...props}
    >
      {() => (
        <InfoPanel
          variant='info'
          className={cx(
            'mx-[10px] mb-[10px] mt-1',
            { ['mb-[10px] mt-1']: !isMyMessage },
            theme === 'dark' ? darkThemeStyles : lightThemeStyles
          )}
        >
          {decryptedMessage ? (
            <div className='flex flex-col gap-2'>
              <span className='text-[#60A5FA]'>📦 Your secret message:</span>
              <span
                className={cx(
                  'text-base',
                  theme === 'dark' ? 'text-white' : 'text-black'
                )}
              >
                {decryptedMessage}
              </span>
            </div>
          ) : (
            <div className='flex gap-1'>
              <span className='min-w-fit'>📦 Only</span>
              <Name
                address={recipient || ''}
                className='min-w-fit font-semibold'
                color={theme === 'dark' ? darkThemeTextColor : '#000'}
              />
              <span className='min-w-fit'>
                is able to read this secret message.
              </span>
            </div>
          )}
        </InfoPanel>
      )}
    </CommonChatItem>
  )
}
