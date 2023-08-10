import LoginModal from '@/components/auth/LoginModal'
import { useOpenDonateExtension } from '@/components/extensions/donate/hooks'
import { canUsePromoExtensionAccounts } from '@/components/extensions/secret-box/utils'
import FloatingMenus, {
  FloatingMenusProps,
} from '@/components/floating/FloatingMenus'
import MetadataModal from '@/components/modals/MetadataModal'
import ModerationModal from '@/components/moderation/ModerationModal'
import Toast from '@/components/Toast'
import { COMMUNITY_CHAT_HUB_ID } from '@/constants/hubs'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import { useCanSendMessage } from '@/hooks/useCanSendMessage'
import { getPostQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useChatMenu } from '@/stores/chat-menu'
import { useExtensionData } from '@/stores/extension'
import { useMessageData } from '@/stores/message'
import { useMyAccount } from '@/stores/my-account'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { copyToClipboard } from '@/utils/strings'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BiGift } from 'react-icons/bi'
import { BsFillReplyFill } from 'react-icons/bs'
import { HiCircleStack, HiLink } from 'react-icons/hi2'
import { LuShield } from 'react-icons/lu'
import { MdContentCopy } from 'react-icons/md'
import { RiCopperCoinLine } from 'react-icons/ri'
import urlJoin from 'url-join'

export type ChatItemMenusProps = {
  messageId: string
  chatId: string
  hubId: string
  children: FloatingMenusProps['children']
  enableChatMenu?: boolean
}

type ModalState = 'login' | 'metadata' | 'moderate' | null

export default function ChatItemMenus({
  messageId,
  children,
  chatId,
  hubId,
  enableChatMenu = true,
}: ChatItemMenusProps) {
  const canSendMessage = useCanSendMessage(hubId, chatId)

  const isOpen = useChatMenu((state) => state.openedChatId === messageId)
  const setIsOpenChatMenu = useChatMenu((state) => state.setOpenedChatId)

  const router = useRouter()
  const isLoggingInWithKey = useRef(false)

  const address = useMyAccount((state) => state.address)
  const { data: message } = getPostQuery.useQuery(messageId)
  const [modalState, setModalState] = useState<ModalState>(null)

  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )
  const openDonateExtension = useOpenDonateExtension(
    message?.id,
    message?.struct.ownerId ?? ''
  )

  const setReplyTo = useMessageData((state) => state.setReplyTo)
  const setMessageAsReply = (messageId: string) => {
    if (isOptimisticId(messageId)) return
    setReplyTo(messageId)
  }

  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const { ownerId } = message?.struct || {}
  const { data: messageOwnerAccountData } = getAccountDataQuery.useQuery(
    ownerId ?? ''
  )
  const { evmAddress: messageOwnerEvmAddress } = messageOwnerAccountData || {}

  const isSent = !isOptimisticId(messageId)

  const getChatMenus = (): FloatingMenusProps['menus'] => {
    const donateMenuItem: FloatingMenusProps['menus'][number] = {
      text: 'Donate',
      icon: RiCopperCoinLine,
      onClick: () => {
        if (!messageOwnerEvmAddress) {
          return
        }

        if (!address) {
          setModalState('login')
          return
        }

        openDonateExtension()
      },
    }

    const replyItem: FloatingMenusProps['menus'][number] = {
      text: 'Reply',
      icon: BsFillReplyFill,
      onClick: () => setMessageAsReply(messageId),
    }

    const showDonateMenuItem = messageOwnerEvmAddress && canSendMessage

    return [
      ...(canSendMessage ? [replyItem] : []),
      ...(showDonateMenuItem ? [donateMenuItem] : []),
      ...(isAuthorized
        ? [
            {
              icon: LuShield,
              text: 'Moderate',
              onClick: () => setModalState('moderate'),
            },
          ]
        : []),
      ...(address && canUsePromoExtensionAccounts.includes(address)
        ? [
            {
              text: 'Secret Box',
              icon: BiGift,
              onClick: () => {
                openExtensionModal('subsocial-decoded-promo', {
                  recipient: ownerId ?? '',
                  messageId,
                })
              },
            },
          ]
        : []),
      {
        text: 'Copy Text',
        icon: MdContentCopy,
        onClick: () => {
          copyToClipboard(message?.content?.body ?? '')
          toast.custom((t) => (
            <Toast t={t} title='Message copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Copy Message Link',
        icon: HiLink,
        onClick: () => {
          const chatPageLink = urlJoin(
            getCurrentUrlOrigin(),
            getChatPageLink(router)
          )
          copyToClipboard(urlJoin(chatPageLink, messageId))
          toast.custom((t) => (
            <Toast t={t} title='Message link copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Show Metadata',
        icon: HiCircleStack,
        onClick: () => setModalState('metadata'),
      },
    ]
  }
  const menus = enableChatMenu && isSent ? getChatMenus() : []

  return (
    <>
      <FloatingMenus
        menus={menus}
        allowedPlacements={[
          'right',
          'top',
          'bottom',
          'right-end',
          'top-end',
          'bottom-end',
        ]}
        useClickPointAsAnchor
        manualMenuController={{
          open: isOpen,
          onOpenChange: (isOpen) => {
            setIsOpenChatMenu(isOpen ? messageId : null)
          },
        }}
      >
        {children}
      </FloatingMenus>
      {message && (
        <MetadataModal
          isOpen={modalState === 'metadata'}
          closeModal={() => setModalState(null)}
          entity={message}
        />
      )}
      <LoginModal
        isOpen={modalState === 'login'}
        openModal={() => setModalState('login')}
        closeModal={() => setModalState(null)}
        beforeLogin={() => (isLoggingInWithKey.current = true)}
        afterLogin={() => (isLoggingInWithKey.current = false)}
      />
      {COMMUNITY_CHAT_HUB_ID && (
        <ModerationModal
          isOpen={modalState === 'moderate'}
          closeModal={() => setModalState(null)}
          messageId={messageId}
          chatId={chatId}
          hubId={COMMUNITY_CHAT_HUB_ID}
        />
      )}
    </>
  )
}
