import LoginModal from '@/components/auth/LoginModal'
import { useOpenDonateExtension } from '@/components/extensions/donate/hooks'
import { canUsePromoExtensionAccounts } from '@/components/extensions/secret-box/utils'
import FloatingMenus, {
  FloatingMenusProps,
} from '@/components/floating/FloatingMenus'
import MetadataModal from '@/components/modals/MetadataModal'
import Toast from '@/components/Toast'
import { getPostQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { isOptimisticId } from '@/services/subsocial/utils'
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
import { MdContentCopy } from 'react-icons/md'
import { RiCopperCoinLine } from 'react-icons/ri'
import urlJoin from 'url-join'

export type ChatItemMenusProps = {
  messageId: string
  children: FloatingMenusProps['children']
  enableCustomMenu?: boolean
}

type ModalState = 'login' | 'metadata' | null

export default function ChatItemMenus({
  messageId,
  children,
  enableCustomMenu = true,
}: ChatItemMenusProps) {
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

    const showDonateMenuItem = messageOwnerEvmAddress

    return [
      {
        text: 'Reply',
        icon: BsFillReplyFill,
        onClick: () => setMessageAsReply(messageId),
      },
      ...(showDonateMenuItem ? [donateMenuItem] : []),
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
  const menus = enableCustomMenu && isSent ? getChatMenus() : []

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
    </>
  )
}
