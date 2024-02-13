import InfoPanel from '@/components/InfoPanel'
import { ProfilePreviewModalName } from '@/components/ProfilePreviewModalWrapper'
import useGetTheme from '@/hooks/useGetTheme'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'
import CommonChatItem from '../common/CommonChatItem'
import { ExtensionChatItemProps } from '../types'
import { getPostExtensionProperties } from '../utils'
import { useDecodeSecretBox } from './utils'

export default function SecretBoxChatItem(props: ExtensionChatItemProps) {
  const [decryptedMessage, setDecryptedMessage] = useState<string>()
  const myAddress = useMyMainAddress()
  const theme = useGetTheme()
  const { mutateAsync: decodeSecretBox } = useDecodeSecretBox()

  const { message, isMyMessage } = props
  const { content } = message
  const { extensions } = content || {}

  const decodedPromoProperties = getPostExtensionProperties(
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

  const darkThemeTextColor = isMyMessage ? '#FFF' : '#60A5FA'

  return (
    <CommonChatItem
      othersMessage={{ checkMark: 'top' }}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      {...props}
    >
      {() => (
        <InfoPanel
          variant='info'
          className={cx(
            'mx-[10px] mb-[10px] mt-1',
            { ['mb-[10px] mt-1']: !isMyMessage },
            isMyMessage
              ? 'bg-[#E0E7FF] text-black dark:bg-[#6660DF] dark:text-white'
              : 'bg-[#EEF2FF] text-black dark:bg-[#3B82F6]/10 dark:text-[#60A5FA]'
          )}
        >
          {decryptedMessage ? (
            <div className='flex flex-col gap-2'>
              <span className='text-[#60A5FA]'>📦 Your secret message:</span>
              <span className={cx('text-base text-black dark:text-white')}>
                {decryptedMessage}
              </span>
            </div>
          ) : (
            <span>
              📦 Only{' '}
              <ProfilePreviewModalName
                showModeratorChip
                address={recipient || ''}
                className='!inline font-semibold'
                profileSourceIconPosition='none'
                color={theme === 'dark' ? darkThemeTextColor : '#000'}
              />{' '}
              is able to read this secret message.
            </span>
          )}
        </InfoPanel>
      )}
    </CommonChatItem>
  )
}
