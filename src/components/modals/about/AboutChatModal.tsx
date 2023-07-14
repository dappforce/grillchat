import ProfilePreview from '@/components/ProfilePreview'
import ProfilePreviewModalWrapper from '@/components/ProfilePreviewModalWrapper'
import useIsInIframe from '@/hooks/useIsInIframe'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import { getPostQuery } from '@/services/api/query'
import {
  HideUnhideChatWrapper,
  JoinChatParams,
  JoinChatWrapper,
  LeaveChatWrapper,
} from '@/services/subsocial/posts/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  HiCircleStack,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiPencilSquare,
  HiQrCode,
} from 'react-icons/hi2'
import { RxEnter, RxExit } from 'react-icons/rx'
import urlJoin from 'url-join'
import UpsertChatModal from '../community/UpsertChatModal'
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
  const address = useMyAccount((state) => state.address)
  const router = useRouter()
  const { data: chat } = getPostQuery.useQuery(chatId)

  const [openedModalType, setOpenedModalType] = useState<
    'metadata' | 'qr' | 'confirmation-leave' | 'edit' | 'hide' | 'unhide' | null
  >(null)

  const isInIframe = useIsInIframe()
  const { isJoined, isLoading } = useIsJoinedToChat(chatId)

  const content = chat?.content
  if (!content) return null

  const chatUrl = urlJoin(getCurrentUrlOrigin(), getChatPageLink(router))
  const chatOwner = chat.struct.ownerId

  const contentList: AboutModalProps['contentList'] = [
    { title: 'Description', content: content.body },
    {
      title: 'Chat link',
      content: chatUrl,
      textToCopy: chatUrl,
      redirectTo: chatUrl,
      openInNewTab: true,
    },
    {
      title: 'Chat Owner',
      content: (
        <ProfilePreviewModalWrapper address={chatOwner}>
          {(onClick) => (
            <ProfilePreview
              onClick={onClick}
              address={chatOwner}
              className='mt-1 cursor-pointer gap-2'
              avatarClassName={cx('h-6 w-6')}
              withGrillAddress={false}
              withEvmAddress={false}
              nameClassName='text-base'
            />
          )}
        </ProfilePreviewModalWrapper>
      ),
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

    if (chatOwner === address || true) {
      actionMenu.push({
        text: 'Edit',
        icon: HiPencilSquare,
        iconClassName: cx('text-text-muted'),
        onClick: () => setOpenedModalType('edit'),
      })

      if (chat.struct.hidden) {
        actionMenu.push({
          text: 'Unhide Chat',
          icon: HiOutlineEye,
          iconClassName: cx('text-text-muted'),
          onClick: () => setOpenedModalType('unhide'),
        })
      } else {
        actionMenu.push({
          text: 'Hide Chat',
          icon: HiOutlineEyeSlash,
          iconClassName: cx('text-text-muted'),
          onClick: () => setOpenedModalType('hide'),
        })
      }
    }

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

  const closeModal = () => setOpenedModalType(null)

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
            closeModal={closeModal}
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
        onBackClick={closeModal}
        closeModal={closeModal}
        isOpen={openedModalType === 'metadata'}
        entity={chat}
        postIdTextPrefix='Chat'
      />
      <QrCodeModal
        isOpen={openedModalType === 'qr'}
        closeModal={closeModal}
        title='Chat QR Code'
        description='You can use this QR code to quickly share the chat with anyone.'
        withCloseButton
        onBackClick={closeModal}
        url={chatUrl}
        urlTitle={content.title}
      />
      <UpsertChatModal
        chat={chat}
        isOpen={openedModalType === 'edit'}
        closeModal={closeModal}
      />
      <HideUnhideChatWrapper>
        {({ isLoading, mutateAsync }) => {
          return (
            <>
              <ConfirmationModal
                isOpen={openedModalType === 'hide'}
                title='🤔 Are you sure you want to hide this chat?'
                closeModal={closeModal}
                primaryButtonProps={{ children: 'No, keep this chat visible' }}
                secondaryButtonProps={{
                  children: 'Yes, hide this chat',
                  isLoading,
                  onClick: async () => {
                    await mutateAsync({ postId: chatId, action: 'hide' })
                  },
                }}
              />
              <ConfirmationModal
                isOpen={openedModalType === 'unhide'}
                title='🤔 Are you sure you want to make this chat visible to everyone?'
                closeModal={closeModal}
                primaryButtonProps={{ children: 'No, keep this chat hidden' }}
                secondaryButtonProps={{
                  children: 'Yes, make this chat visible to everyone',
                  isLoading,
                  onClick: async () => {
                    await mutateAsync({ postId: chatId, action: 'unhide' })
                  },
                }}
              />
            </>
          )
        }}
      </HideUnhideChatWrapper>
    </>
  )
}
