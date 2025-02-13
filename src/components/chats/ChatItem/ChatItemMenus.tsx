import Button from '@/components/Button'
import Toast from '@/components/Toast'
import FloatingMenus, {
  FloatingMenusProps,
} from '@/components/floating/FloatingMenus'
import MetadataModal from '@/components/modals/MetadataModal'
import { useReferralSearchParam } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import { useCanSendMessage } from '@/hooks/useCanSendMessage'
import useIsOwnerOfPost from '@/hooks/useIsOwnerOfPost'
import useRerender from '@/hooks/useRerender'
import { getPostQuery } from '@/services/api/query'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { useChatMenu } from '@/stores/chat-menu'
import { useMessageData } from '@/stores/message'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { estimatedWaitTime } from '@/utils/network'
import { copyToClipboard } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiLink } from 'react-icons/fi'
import { HiChevronRight } from 'react-icons/hi2'
import { LuPencil, LuReply } from 'react-icons/lu'
import { MdContentCopy } from 'react-icons/md'
import { RiDatabase2Line } from 'react-icons/ri'
import urlJoin from 'url-join'

export type ChatItemMenusProps = {
  messageId: string
  chatId: string
  hubId: string
  children: FloatingMenusProps['children']
  enableChatMenu?: boolean
}

type ModalState = 'metadata' | 'moderate' | 'hide' | null

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
  const refSearchParam = useReferralSearchParam()

  const router = useRouter()

  const { data: message } = getPostQuery.useQuery(messageId)
  const [modalState, setModalState] = useState<ModalState>(null)

  const setReplyTo = useMessageData((state) => state.setReplyTo)
  const setMessageToEdit = useMessageData((state) => state.setMessageToEdit)

  const { dataType } = message?.struct || {}

  const isOptimisticMessage = dataType === 'optimistic'

  const getChatMenus = (): FloatingMenusProps['menus'] => {
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
        icon: FiLink,
        onClick: () => {
          const chatPageLink = urlJoin(
            getCurrentUrlOrigin(),
            env.NEXT_PUBLIC_BASE_PATH,
            getChatPageLink(router)
          )
          copyToClipboard(urlJoin(chatPageLink, messageId, refSearchParam))
          toast.custom((t) => (
            <Toast t={t} title='Message link copied to clipboard!' />
          ))
        },
      },
      {
        text: 'Show Metadata',
        icon: RiDatabase2Line,
        onClick: () => setModalState('metadata'),
      },
    ]

    if (isOptimisticMessage) return menus

    const replyItem: FloatingMenusProps['menus'][number] = {
      text: 'Reply',
      icon: LuReply,
      onClick: () => setReplyTo(messageId),
    }
    const editItem: FloatingMenusProps['menus'][number] = {
      text: 'Edit',
      icon: LuPencil,
      onClick: () => setMessageToEdit(messageId),
    }

    if (isDatahubAvailable && canSendMessage && isMessageOwner)
      menus.unshift(editItem)
    if (canSendMessage) menus.unshift(replyItem)

    return menus
  }
  const menus = enableChatMenu ? getChatMenus() : []

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
    </>
  )
}

function MintingMessageNotice({ message }: { message: PostData }) {
  const rerender = useRerender()
  const createdAt = message.struct.createdAtTime
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const REFRESH_INTERVAL = 60 * 1000 * 5 // 5 minutes
    const intervalId = setInterval(() => {
      rerender()
    }, REFRESH_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [rerender])

  const tenMins = 1000 * 60 * 10
  const isMoreThan10Mins =
    new Date().getTime() - new Date(createdAt).getTime() > tenMins

  return (
    <div className='flex flex-col overflow-hidden border-b border-border-gray p-4 pb-3 text-sm text-text-muted'>
      <Button
        size='noPadding'
        className='-mx-2 -my-1 flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1 hover:bg-background-lighter'
        variant='transparent'
        interactive='brightness-only'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{isMoreThan10Mins ? 'Not minted yet' : 'Message is being minted'}</p>
        <Button
          size='noPadding'
          variant='transparent'
          interactive='none'
          className={cx(
            'flex-shrink-0 p-0.5 transition-transform',
            isOpen && 'rotate-90'
          )}
        >
          <HiChevronRight />
        </Button>
      </Button>
      <Transition
        show={isOpen}
        className='transition'
        enterFrom={cx('opacity-0 -translate-y-2')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 -top-4'
      >
        <p className='pt-2'>
          {isMoreThan10Mins
            ? 'It will be available as an off-chain message in 1 hour, and can then be replied to.'
            : `To interact with this message please wait until it is saved to the blockchain (≈ ${estimatedWaitTime} sec).`}
        </p>
      </Transition>
    </div>
  )
}
