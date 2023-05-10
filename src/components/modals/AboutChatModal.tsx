import { getPostQuery } from '@/services/api/query'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { PostData } from '@subsocial/api/types'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { IconType } from 'react-icons'
import { HiCircleStack } from 'react-icons/hi2'
import urlJoin from 'url-join'
import Button, { ButtonProps } from '../Button'
import { CopyTextInline } from '../CopyText'
import MetadataModal from './MetadataModal'
import Modal, { ModalFunctionalityProps } from './Modal'

export type AboutChatModalProps = ModalFunctionalityProps & {
  chatId: string
  messageCount?: number
}

type Content = {
  title: string
  content: (data: { chat: PostData; url: string }) => string | undefined
  withCopyButton?: boolean
}
const contentList: Content[] = [
  { title: 'Description', content: ({ chat }) => chat.content?.body },
  {
    title: 'Chat link',
    content: ({ url }) => url,
    withCopyButton: true,
  },
]

export default function AboutChatModal({
  chatId,
  messageCount = 0,
  ...props
}: AboutChatModalProps) {
  const router = useRouter()
  const { data: chat } = getPostQuery.useQuery(chatId)
  const [isOpenMetadataModal, setIsOpenMetadataModal] = useState(false)

  const actionMenu = useMemo<
    {
      text: string
      icon: IconType
      className?: string
      onClick: ButtonProps['onClick']
    }[]
  >(() => {
    return [
      {
        text: 'Show Metadata',
        icon: HiCircleStack,
        className: cx('text-text-secondary'),
        onClick: () => setIsOpenMetadataModal(true),
      },
    ]
  }, [])

  const content = chat?.content
  if (!content) return null

  const chatUrl = urlJoin(getCurrentUrlOrigin(), getChatPageLink(router))

  return (
    <Modal {...props} withCloseButton>
      <div className='mt-4 flex flex-col items-center gap-4'>
        <div className='flex flex-col items-center text-center'>
          <Image
            src={getIpfsContentUrl(content.image)}
            className={cx(
              getCommonClassNames('chatImageBackground'),
              'h-20 w-20'
            )}
            height={80}
            width={80}
            alt=''
          />
          <h1 className='mt-4 text-2xl font-medium'>{content.title}</h1>
          <span className='text-text-muted'>{messageCount} messages</span>
        </div>
        <div className='flex w-full flex-col gap-3 rounded-2xl bg-background-lighter px-4 py-4'>
          {contentList.map(({ content, title, withCopyButton }) => {
            const contentValue = content({ chat, url: chatUrl })
            if (!contentValue) return null
            const containerClassName = cx(
              'border-b border-background-lightest pb-3 last:border-none last:pb-0'
            )
            const element = (
              <div key={title} className={cx('flex flex-1 flex-col gap-0.5')}>
                <span className='text-sm text-text-muted'>{title}</span>
                {withCopyButton ? (
                  <CopyTextInline
                    text={contentValue}
                    withButton={false}
                    className='text-text-secondary'
                  />
                ) : (
                  <span>{contentValue}</span>
                )}
              </div>
            )

            return (
              <div
                key={title}
                className={cx('flex w-full items-center', containerClassName)}
              >
                {withCopyButton ? (
                  <div className={cx('flex w-full items-center')}>
                    {element}
                    <div>
                      <CopyTextInline
                        textClassName='flex-1'
                        className='w-full'
                        textContainerClassName='w-full'
                        text={''}
                        textToCopy={contentValue}
                      />
                    </div>
                  </div>
                ) : (
                  element
                )}
              </div>
            )
          })}
        </div>
        <div className='w-full overflow-hidden rounded-2xl bg-background-lighter'>
          {actionMenu.map(({ icon: Icon, text, className, onClick }) => (
            <Button
              variant='transparent'
              interactive='none'
              size='noPadding'
              key={text}
              className={cx(
                'flex w-full items-center gap-3 rounded-none border-b border-background-lightest p-4 last:border-none',
                'transition focus-visible:bg-background-lightest hover:bg-background-lightest',
                className
              )}
              onClick={onClick}
            >
              <Icon className='text-xl' />
              <span>{text}</span>
            </Button>
          ))}
        </div>
      </div>
      <MetadataModal
        closeModal={() => setIsOpenMetadataModal(false)}
        isOpen={isOpenMetadataModal}
        post={chat}
        postIdTextPrefix='Chat'
      />
    </Modal>
  )
}
