import Button, { ButtonProps } from '@/components/Button'
import MetadataModal from '@/components/chats/ChatItem/MetadataModal'
import Container from '@/components/Container'
import { CopyTextInline } from '@/components/CopyText'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { getPostQuery } from '@/services/api/query'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { PostData } from '@subsocial/api/types'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useMemo, useState } from 'react'
import { IconType } from 'react-icons'
import { HiCircleStack } from 'react-icons/hi2'
import urlJoin from 'url-join'

export type AboutChatPageProps = { chatId: string; messageCount: number }

const contentList: {
  title: string
  content: (data: { chat: PostData; url: string }) => string | undefined
  withCopyButton?: boolean
}[] = [
  { title: 'Description', content: ({ chat }) => chat.content?.body },
  {
    title: 'Chat link',
    content: ({ url }) => url,
    withCopyButton: true,
  },
]

export default function AboutChatPage({
  chatId,
  messageCount,
}: AboutChatPageProps) {
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
        text: 'Show metadata',
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
    <DefaultLayout
      withBackButton={{ isTransparent: true, defaultBackTo: chatUrl }}
    >
      <Container as='div' className='mt-4 flex flex-col items-center gap-4'>
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
        <div className='flex w-full flex-col gap-3 rounded-2xl bg-background-light px-4 py-4'>
          {contentList.map(({ content, title, withCopyButton }) => {
            const contentValue = content({ chat, url: chatUrl })
            if (!contentValue) return null
            const element = (
              <div
                key={title}
                className={cx(
                  'flex flex-col gap-0.5 border-b border-background-lighter pb-3 last:border-none last:pb-0'
                )}
              >
                <span className='text-sm text-text-muted'>{title}</span>
                <span>{contentValue}</span>
              </div>
            )

            return (
              <Fragment key={title}>
                {withCopyButton ? (
                  <CopyTextInline
                    textClassName='flex-1'
                    className='w-full'
                    text={element}
                    textToCopy={contentValue}
                  />
                ) : (
                  element
                )}
              </Fragment>
            )
          })}
        </div>
        <div className='w-full overflow-hidden rounded-2xl bg-background-light'>
          {actionMenu.map(({ icon: Icon, text, className, onClick }) => (
            <Button
              variant='transparent'
              interactive='none'
              size='noPadding'
              key={text}
              className={cx(
                'flex w-full items-center gap-3 rounded-none border-b border-background-lighter p-4 last:border-none',
                'transition focus-visible:bg-background-lighter hover:bg-background-lighter',
                className
              )}
              onClick={onClick}
            >
              <Icon className='text-xl' />
              <span>{text}</span>
            </Button>
          ))}
        </div>
      </Container>
      <MetadataModal
        closeModal={() => setIsOpenMetadataModal(false)}
        isOpen={isOpenMetadataModal}
        post={chat}
        postIdTextPrefix='Chat'
      />
    </DefaultLayout>
  )
}
