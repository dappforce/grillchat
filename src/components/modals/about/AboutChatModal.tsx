import useIsInIframe from '@/hooks/useIsInIframe'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import { getPostQuery } from '@/services/api/query'
import {
  JoinChatParams,
  JoinChatWrapper,
  LeaveChatWrapper,
} from '@/services/subsocial/posts/mutation'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCircleStack, HiQrCode } from 'react-icons/hi2'
import { RxEnter, RxExit } from 'react-icons/rx'
import urlJoin from 'url-join'
import ConfirmationModal from '../ConfirmationModal'
import MetadataModal from '../MetadataModal'
import { ModalFunctionalityProps } from '../Modal'
import QrCodeModal from '../QrCodeModal'
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

  const [openedModalType, setOpenedModalType] = useState<
    'metadata' | 'qr' | 'confirmation-leave' | null
  >(null)

  const isInIframe = useIsInIframe()
  const { isJoined, isLoading } = useIsJoinedToChat(chatId)

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

  const getActionMenu = (
    joinChat: (variables: JoinChatParams) => Promise<string | undefined>,
    isJoiningChat?: boolean
  ) => {
    const actionMenu: AboutModalProps['actionMenu'] = [
      {
        text: 'Show QR code',
        iconClassName: 'text-text-muted',
        icon: HiQrCode,
        onClick: () => setOpenedModalType('qr'),
      },
      {
        text: 'Show Metadata',
        iconClassName: cx('text-text-muted'),
        icon: HiCircleStack,
        onClick: () => setOpenedModalType('metadata'),
      },
    ]

    if (isLoading || isInIframe) return actionMenu

    if (isJoined) {
      actionMenu.push({
        text: 'Leave Chat',
        icon: RxExit,
        onClick: () => setOpenedModalType('confirmation-leave'),
        className: cx('text-text-red'),
      })
    } else {
      actionMenu.push({
        text: 'Join Chat',
        icon: RxEnter,
        disabled: isJoiningChat,
        className: cx('text-text-secondary'),
        onClick: async () => {
          await joinChat({ chatId })
          props.closeModal()
        },
      })
    }

    return actionMenu
  }

  return (
    <>
      <JoinChatWrapper>
        {({ mutateAsync, isLoading }) => {
          return (
            <AboutModal
              {...props}
              isOpen={props.isOpen && openedModalType === null}
              title={content?.title}
              subtitle={`${messageCount} messages`}
              actionMenu={getActionMenu(mutateAsync, isLoading)}
              contentList={contentList}
              image={content?.image}
            />
          )
        }}
      </JoinChatWrapper>
      <LeaveChatWrapper>
        {({ isLoading, mutateAsync }) => (
          <ConfirmationModal
            isOpen={openedModalType === 'confirmation-leave'}
            closeModal={() => setOpenedModalType(null)}
            title='🤔 Are you sure you want to leave this chat?'
            primaryButtonProps={{ children: 'No, stay here' }}
            secondaryButtonProps={{
              children: 'Yes, leave chat',
              onClick: async () => {
                await mutateAsync({ chatId })
                props.closeModal()
              },
              isLoading,
            }}
          />
        )}
      </LeaveChatWrapper>
      <MetadataModal
        onBackClick={() => setOpenedModalType(null)}
        closeModal={() => setOpenedModalType(null)}
        isOpen={openedModalType === 'metadata'}
        entity={chat}
        postIdTextPrefix='Chat'
      />
      <QrCodeModal
        isOpen={openedModalType === 'qr'}
        closeModal={() => setOpenedModalType(null)}
        title='Chat QR Code'
        description='You can use this QR code to quickly share the chat with anyone.'
        withCloseButton
        onBackClick={() => setOpenedModalType(null)}
        url={chatUrl}
        urlTitle={content.title}
      />
    </>
  )
}
