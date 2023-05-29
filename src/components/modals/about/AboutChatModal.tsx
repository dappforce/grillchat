import Button from '@/components/Button'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import { getPostQuery } from '@/services/api/query'
import {
  JoinChatWrapper,
  LeaveChatWrapper,
} from '@/services/subsocial/posts/mutation'
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

  const isJoinedToChat = useIsJoinedToChat(chatId)

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

  const actionMenu: AboutModalProps['actionMenu'] = [
    {
      text: 'Show Metadata',
      icon: HiCircleStack,
      onClick: () => setIsOpenMetadataModal(true),
    },
  ]

  if (isJoinedToChat) {
    actionMenu.push({
      text: 'Leave Chat',
      icon: RxExit,
      onClick: () => setIsOpenConfirmation(true),
    })
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
          !isJoinedToChat ? (
            <JoinChatWrapper>
              {({ mutateAsync, isLoading }) => (
                <Button
                  size='lg'
                  isLoading={isLoading}
                  onClick={() => mutateAsync({ chatId })}
                  className='mt-2 w-full'
                >
                  Join
                </Button>
              )}
            </JoinChatWrapper>
          ) : null
        }
      />
      <LeaveChatWrapper>
        {({ isLoading, mutateAsync }) => (
          <ConfirmationModal
            isOpen={isOpenConfirmation}
            closeModal={() => setIsOpenConfirmation(false)}
            title='🤔 Are you sure you want to leave this chat?'
            primaryButtonProps={{ children: 'No, stay here' }}
            secondaryButtonProps={{
              children: 'Yes, leave chat',
              onClick: async () => {
                await mutateAsync({ chatId })
              },
              isLoading,
            }}
          />
        )}
      </LeaveChatWrapper>
      <MetadataModal
        closeModal={() => setIsOpenMetadataModal(false)}
        isOpen={isOpenMetadataModal}
        entity={chat}
        postIdTextPrefix='Chat'
      />
    </>
  )
}
