import { getPostQuery } from '@/services/api/query'
import { cx, getCommonClassNames } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { IconType } from 'react-icons'
import { HiCircleStack } from 'react-icons/hi2'
import urlJoin from 'url-join'
import Button, { ButtonProps } from '../Button'
import DataCard, { DataCardProps } from '../DataCard'
import MetadataModal from './MetadataModal'
import Modal, { ModalFunctionalityProps } from './Modal'

export type AboutChatModalProps = ModalFunctionalityProps & {
  chatId: string
  messageCount?: number
}

export default function AboutChatModal({
  chatId,
  messageCount = 0,
  ...props
}: AboutChatModalProps) {
  const router = useRouter()
  const { data: chat } = getPostQuery.useQuery(chatId)
  const [isOpenMetadataModal, setIsOpenMetadataModal] = useState(false)

  const content = chat?.content
  const chatUrl = urlJoin(
    getCurrentUrlOrigin(),
    getChatPageLink(router),
    '/about'
  )

  const contentList: DataCardProps['data'] = [
    { title: 'Description', content: chat?.content?.body },
    {
      title: 'Chat link',
      content: chatUrl,
      withCopyButton: true,
    },
  ]

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

  if (!content) return null

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
        <DataCard data={contentList} />
        <div className='w-full overflow-hidden rounded-2xl bg-background-lighter'>
          {actionMenu.map(({ icon: Icon, text, className, onClick }) => (
            <Button
              variant='transparent'
              interactive='none'
              size='noPadding'
              key={text}
              className={cx(
                'flex w-full items-center gap-3 rounded-none border-b border-background-lightest p-4 last:border-none',
                'transition hover:bg-background-lightest focus-visible:bg-background-lightest',
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
