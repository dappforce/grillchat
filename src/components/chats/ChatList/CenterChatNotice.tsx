import LinkText from '@/components/LinkText'
import { useConfigContext } from '@/providers/ConfigProvider'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export default function CenterChatNotice({
  isMyChat,
  ...props
}: ComponentProps<'div'> & { isMyChat: boolean }) {
  const { customTexts } = useConfigContext()

  return (
    <div
      {...props}
      className={cx(
        'flex flex-col rounded-2xl bg-background-light/50 px-6 py-4 text-sm text-text-muted',
        props.className
      )}
    >
      {isMyChat ? (
        <>
          <div>
            <span>You have created a public group chat, which is:</span>
            <div className='pl-4'>
              <ul className='mb-1 list-disc whitespace-nowrap pl-2'>
                <li>Persistent & on-chain</li>
                <li>Censorship resistant</li>
                <li>
                  Powered by{' '}
                  <LinkText
                    href='https://subsocial.network'
                    openInNewTab
                    variant='primary'
                  >
                    Subsocial
                  </LinkText>
                </li>
              </ul>
            </div>

            <span>You can:</span>
            <div className='pl-4'>
              <ul className='list-disc whitespace-nowrap pl-2'>
                <li>Moderate content and users</li>
                <li>Hide the chat from others on Grill</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <span>{customTexts?.noTextInChannel ?? 'No messages here yet'}</span>
      )}
    </div>
  )
}
