import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCircleStack } from 'react-icons/hi2'
import urlJoin from 'url-join'
import MetadataModal from '../MetadataModal'
import { ModalFunctionalityProps } from '../Modal'
import AboutModal, { AboutModalProps } from './AboutModal'

export type AboutChatModalProps = ModalFunctionalityProps & {
  chatId: string
  messageCount?: number
}

type ContentData = { chat: PostData; url: string }
type Content = {
  title: string
  content: (data: ContentData) => string | undefined
  withCopyButton?: boolean
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
  if (!content) return null

  const chatUrl = urlJoin(getCurrentUrlOrigin(), getChatPageLink(router))

  const contentList: AboutModalProps['contentList'] = [
    { title: 'Description', content: content.body },
    {
      title: 'Chat link',
      content: chatUrl,
      withCopyButton: true,
      redirectTo: chatUrl,
    },
  ]

  const actionMenu: AboutModalProps['actionMenu'] = [
    {
      text: 'Show Metadata',
      icon: HiCircleStack,
      className: cx('text-text-secondary'),
      onClick: () => setIsOpenMetadataModal(true),
    },
  ]

  return (
    <>
      <AboutModal
        {...props}
        title={content?.title ?? ''}
        subtitle={`${messageCount} messages`}
        actionMenu={actionMenu}
        contentList={contentList}
        imageCid={content?.image ?? ''}
      />
      <MetadataModal
        closeModal={() => setIsOpenMetadataModal(false)}
        isOpen={isOpenMetadataModal}
        post={chat}
        postIdTextPrefix='Chat'
      />
    </>
  )
}
