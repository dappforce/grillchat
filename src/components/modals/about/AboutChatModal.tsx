import Button from '@/components/Button'
import { getPostQuery } from '@/services/api/query'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCircleStack } from 'react-icons/hi2'
import { RxExit } from 'react-icons/rx'
import urlJoin from 'url-join'
import ConfirmationModal from '../ConfirmationModal'
import MetadataModal from '../MetadataModal'
import { ModalFunctionalityProps } from '../Modal'
import AboutModal, { AboutModalProps } from './AboutModal'

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
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false)

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
      openInNewTab: true,
    },
  ]

  const hasJoined = true

  const actionMenu: AboutModalProps['actionMenu'] = [
    {
      text: 'Show Metadata',
      icon: HiCircleStack,
      onClick: () => setIsOpenMetadataModal(true),
    },
  ]
  if (hasJoined) {
    actionMenu.push({
      text: 'Leave Chat',
      icon: RxExit,
      onClick: () => setIsOpenConfirmation(true),
    })
  }

  const leaveChat = () => {
    // TODO: implementation here
  }

  return (
    <>
      <AboutModal
        {...props}
        title={content?.title ?? ''}
        subtitle={`${messageCount} messages`}
        actionMenu={actionMenu}
        contentList={contentList}
        imageCid={content?.image ?? ''}
        bottomElement={
          !hasJoined ? (
            <Button size='lg' className='mt-2 w-full'>
              Join
            </Button>
          ) : null
        }
      />
      <ConfirmationModal
        isOpen={isOpenConfirmation}
        closeModal={() => setIsOpenConfirmation(false)}
        title='🤔 Are you sure you want to leave this chat?'
        primaryButton={{ text: 'No, stay here' }}
        secondaryButton={{ text: 'Yes, leave chat', onClick: leaveChat }}
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
