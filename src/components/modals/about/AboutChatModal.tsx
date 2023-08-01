import ModerateIcon from '@/assets/icons/moderate.svg'
import { ActionCardProps } from '@/components/ActionCard'
import ChatHiddenChip from '@/components/chats/ChatHiddenChip'
import UpsertChatModal from '@/components/community/UpsertChatModal'
import ModerationInfoModal from '@/components/moderation/ModerationInfoModal'
import PluralText from '@/components/PluralText'
import ProfilePreview from '@/components/ProfilePreview'
import ProfilePreviewModalWrapper from '@/components/ProfilePreviewModalWrapper'
import TruncatedText from '@/components/TruncatedText'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import useIsInIframe from '@/hooks/useIsInIframe'
import useIsJoinedToChat from '@/hooks/useIsJoinedToChat'
import { getPostQuery } from '@/services/api/query'
import {
  HideUnhideChatWrapper,
  JoinChatParams,
  JoinChatWrapper,
  LeaveChatWrapper,
} from '@/services/subsocial/posts/mutation'
import { useSendEvent } from '@/stores/analytics'
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
import ConfirmationModal from '../ConfirmationModal'
import MetadataModal from '../MetadataModal'
import { ModalFunctionalityProps } from '../Modal'
import QrCodeModal from '../QrCodeModal'
import AboutModal, { AboutModalProps } from './AboutModal'

export type AboutChatModalProps = ModalFunctionalityProps & {
  chatId: string
  messageCount?: number
}

type InnerModalType =
  | 'metadata'
  | 'qr'
  | 'confirmation-leave'
  | 'edit'
  | 'hide'
  | 'unhide'
  | 'moderation'
  | null

export default function AboutChatModal({
  chatId,
  messageCount = 0,
  ...props
}: AboutChatModalProps) {
  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const address = useMyAccount((state) => state.address)
  const router = useRouter()
  const { data: chat } = getPostQuery.useQuery(chatId, {
    showHiddenPost: { type: 'all' },
  })
  const sendEvent = useSendEvent()

  const [openedModalType, setOpenedModalType] = useState<InnerModalType>(null)

  const isInIframe = useIsInIframe()
  const { isJoined, isLoading } = useIsJoinedToChat(chatId)

  const content = chat?.content
  if (!content) return null

  const chatUrl = urlJoin(getCurrentUrlOrigin(), getChatPageLink(router))
  const chatOwner = chat.struct.ownerId

  const contentList: AboutModalProps['contentList'] = [
    {
      title: 'Description',
      content: content.body && <TruncatedText text={content.body} />,
    },
    {
      title: 'Chat link',
      content: chatUrl,
      textToCopy: chatUrl,
      redirectTo: chatUrl,
      openInNewTab: true,
    },
    {
      title: 'Chat owner',
      content: (
        <ProfilePreviewModalWrapper address={chatOwner}>
          {(onClick) => (
            <ProfilePreview
              onClick={onClick}
              address={chatOwner}
              className='relative -left-0.5 mt-1 cursor-pointer gap-2'
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

    const additionalMenus: ActionCardProps['actions'] = []
    if (isAuthorized) {
      additionalMenus.push({
        text: 'Moderation',
        icon: ModerateIcon,
        iconClassName: cx('text-text-muted'),
        onClick: () => setOpenedModalType('moderation'),
      })
    }
    if (chatOwner === address) {
      additionalMenus.push({
        text: 'Edit',
        icon: HiPencilSquare,
        iconClassName: cx('text-text-muted'),
        onClick: () => {
          setOpenedModalType('edit')
          sendEvent('click edit_chat_menu')
        },
      })

      if (chat.struct.hidden) {
        additionalMenus.push({
          text: 'Unhide Chat',
          icon: HiOutlineEye,
          iconClassName: cx('text-text-muted'),
          onClick: () => {
            setOpenedModalType('unhide')
            sendEvent('click unhide_chat_menu')
          },
        })
      } else {
        additionalMenus.push({
          text: 'Hide Chat',
          icon: HiOutlineEyeSlash,
          iconClassName: cx('text-text-muted'),
          onClick: () => {
            setOpenedModalType('hide')
            sendEvent('click hide_chat_menu')
          },
        })
      }

      actionMenu.unshift(...additionalMenus)
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

  let subtitle = (
    <span>
      {messageCount}{' '}
      <PluralText count={messageCount} plural='messages' singular='message' />
    </span>
  )
  const membersCount = chat.struct.followersCount ?? 0
  if (membersCount) {
    subtitle = (
      <span>
        <span>
          {membersCount}{' '}
          <PluralText count={membersCount} plural='members' singular='member' />
        </span>{' '}
        <span className='mx-1'>·</span> {subtitle}
      </span>
    )
  }

  return (
    <>
      <JoinChatWrapper>
        {({ mutateAsync, isLoading }) => {
          return (
            <AboutModal
              {...props}
              id={chat.id}
              isOpen={props.isOpen && openedModalType === null}
              entityTitle={content?.title}
              modalTitle={
                <span>
                  <span>{content?.title}</span>
                  {chat.struct.hidden && (
                    <ChatHiddenChip
                      popOverProps={{
                        triggerClassName: 'inline ml-2',
                        placement: 'top-end',
                      }}
                      className='inline-flex'
                    />
                  )}
                </span>
              }
              subtitle={subtitle}
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
        isOpen={openedModalType === 'edit'}
        closeModal={closeModal}
        onBackClick={closeModal}
        formProps={{ chat }}
      />
      {COMMUNITY_CHAT_HUB_ID && (
        <ModerationInfoModal
          hubId={COMMUNITY_CHAT_HUB_ID}
          isOpen={openedModalType === 'moderation'}
          closeModal={closeModal}
          onBackClick={closeModal}
          chatId={chatId}
        />
      )}
      <HideUnhideChatWrapper>
        {({ isLoading, mutateAsync }) => {
          return (
            <>
              <ConfirmationModal
                isOpen={openedModalType === 'hide'}
                title='🤔 Make this chat hidden?'
                closeModal={closeModal}
                primaryButtonProps={{ children: 'No, keep it public' }}
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
                title='🤔 Make this chat public?'
                closeModal={closeModal}
                primaryButtonProps={{ children: 'No, keep it hidden' }}
                secondaryButtonProps={{
                  children: 'Yes, make it public',
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
