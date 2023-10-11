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
import useIsOwnerOfPost from '@/hooks/useIsOwnerOfPost'
import useToastError from '@/hooks/useToastError'
import { getPostQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { usePinMessage } from '@/services/subsocial/posts/mutation'
import { isOptimisticId } from '@/services/subsocial/utils'
import { useSendEvent } from '@/stores/analytics'
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
import {
  BsFillPencilFill,
  BsFillPinAngleFill,
  BsFillReplyFill,
} from 'react-icons/bs'
import { HiCircleStack, HiLink } from 'react-icons/hi2'
import { LuShield } from 'react-icons/lu'
import { MdContentCopy } from 'react-icons/md'
import { RiCopperCoinLine } from 'react-icons/ri'
import urlJoin from 'url-join'
import usePinnedMessage from '../hooks/usePinnedMessage'

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
  const isMessageOwner = useIsOwnerOfPost(messageId)

  const router = useRouter()
  const isLoggingInWithKey = useRef(false)

  const address = useMyAccount((state) => state.address)
  const { data: message } = getPostQuery.useQuery(messageId)
  const [modalState, setModalState] = useState<ModalState>(null)

  const sendEvent = useSendEvent()

  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )
  const openDonateExtension = useOpenDonateExtension(
    message?.id,
    message?.struct.ownerId ?? ''
  )

  const setReplyTo = useMessageData((state) => state.setReplyTo)
  const setMessageToEdit = useMessageData((state) => state.setMessageToEdit)
  const actionWrapper = (func: (id: string) => void) => {
    if (isOptimisticId(messageId)) return
    func(messageId)
  }

  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const { ownerId } = message?.struct || {}
  const { data: messageOwnerAccountData } = getAccountDataQuery.useQuery(
    ownerId ?? ''
  )
  const { evmAddress: messageOwnerEvmAddress } = messageOwnerAccountData || {}

  const isSent = !isOptimisticId(messageId)

  const pinUnpinMenu = usePinUnpinMenuItem(chatId, messageId)
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

        sendEvent('open_donate_action_modal', { hubId, chatId })
        openDonateExtension()
      },
    }

    const replyItem: FloatingMenusProps['menus'][number] = {
      text: 'Reply',
      icon: BsFillReplyFill,
      onClick: () => actionWrapper(setReplyTo),
    }
    const editItem: FloatingMenusProps['menus'][number] = {
      text: 'Edit',
      icon: BsFillPencilFill,
      onClick: () => actionWrapper(setMessageToEdit),
    }

    const showDonateMenuItem = messageOwnerEvmAddress && canSendMessage

    const menus: FloatingMenusProps['menus'] = [
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

    if (address && canUsePromoExtensionAccounts.includes(address)) {
      menus.unshift({
        text: 'Secret Box',
        icon: BiGift,
        onClick: () => {
          openExtensionModal('subsocial-decoded-promo', {
            recipient: ownerId ?? '',
            messageId,
          })
        },
      })
    }
    if (isAuthorized) {
      menus.unshift({
        icon: LuShield,
        text: 'Moderate',
        onClick: () => {
          sendEvent('open_moderate_action_modal', { hubId, chatId })
          setModalState('moderate')
        },
      })
    }

    if (showDonateMenuItem) menus.unshift(donateMenuItem)
    if (pinUnpinMenu) menus.unshift(pinUnpinMenu)
    if (canSendMessage && isMessageOwner) menus.unshift(editItem)
    if (canSendMessage) menus.unshift(replyItem)

    return menus
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

function usePinUnpinMenuItem(chatId: string, messageId: string) {
  const { mutate: pinMessage, error: pinningError } = usePinMessage()
  const sendEvent = useSendEvent()
  useToastError(pinningError, 'Error pinning message')
  const isChatOwner = useIsOwnerOfPost(chatId)

  const pinnedMessageId = usePinnedMessage(chatId)

  const pinMenuItem: FloatingMenusProps['menus'][number] = {
    text: 'Pin',
    icon: BsFillPinAngleFill,
    onClick: () => {
      sendEvent('pin_message')
      pinMessage({ action: 'pin', chatId, messageId })
    },
  }
  const unpinMenuItem: FloatingMenusProps['menus'][number] = {
    text: 'Unpin',
    icon: BsFillPinAngleFill,
    onClick: () => {
      pinMessage({ action: 'unpin', chatId, messageId })
    },
  }

  if (pinnedMessageId === messageId) return unpinMenuItem
  if (isChatOwner) return pinMenuItem
  return null
}
