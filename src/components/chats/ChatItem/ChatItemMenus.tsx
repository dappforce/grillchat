import Button from '@/components/Button'
import MenuList from '@/components/MenuList'
import Toast from '@/components/Toast'
import { useOpenDonateExtension } from '@/components/extensions/donate/hooks/useOpenDonateExtension'
import { canUsePromoExtensionAccounts } from '@/components/extensions/secret-box/utils'
import FloatingMenus, {
  FloatingMenusProps,
} from '@/components/floating/FloatingMenus'
import PopOver from '@/components/floating/PopOver'
import HideMessageModal from '@/components/modals/HideMessageModal'
import MetadataModal from '@/components/modals/MetadataModal'
import ModerationModal from '@/components/moderation/ModerationModal'
import { useReferralSearchParam } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import { useCanSendMessage } from '@/hooks/useCanSendMessage'
import useIsOwnerOfPost from '@/hooks/useIsOwnerOfPost'
import useRerender from '@/hooks/useRerender'
import useToastError from '@/hooks/useToastError'
import { getPostQuery } from '@/services/api/query'
import { isDatahubAvailable } from '@/services/datahub/utils'
import { usePinMessage } from '@/services/subsocial/posts/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useChatMenu } from '@/stores/chat-menu'
import { useExtensionData } from '@/stores/extension'
import { useLoginModal } from '@/stores/login-modal'
import { useMessageData } from '@/stores/message'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { currentNetwork, estimatedWaitTime } from '@/utils/network'
import { copyToClipboard } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BiGift } from 'react-icons/bi'
import { BsFillPinAngleFill } from 'react-icons/bs'
import { FiLink } from 'react-icons/fi'
import { HiChevronRight, HiOutlineEyeSlash } from 'react-icons/hi2'
import { IoDiamondOutline } from 'react-icons/io5'
import { LuPencil, LuReply, LuShield } from 'react-icons/lu'
import { MdContentCopy } from 'react-icons/md'
import { RiCopperCoinLine, RiDatabase2Line } from 'react-icons/ri'
import urlJoin from 'url-join'
import { SuperLikeWrapper } from '../../content-staking/SuperLike'
import usePinnedMessage from '../hooks/usePinnedMessage'

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
  const isLoggingInWithKey = useRef(false)

  const address = useMyMainAddress()
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

  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const { ownerId, dataType } = message?.struct || {}

  const isOptimisticMessage = dataType === 'optimistic'

  const pinUnpinMenu = usePinUnpinMenuItem(chatId, messageId)
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

    const hideMenu: FloatingMenusProps['menus'][number] = {
      text: 'Hide',
      icon: HiOutlineEyeSlash,
      onClick: () => setModalState('hide'),
    }
    if (isMessageOwner && !isOptimisticMessage) menus.unshift(hideMenu)

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

    if (isOptimisticMessage) return menus

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

    const donateMenuItem: FloatingMenusProps['menus'][number] = {
      text: 'Donate',
      icon: RiCopperCoinLine,
      onClick: () => {
        if (!address) {
          useLoginModal.getState().setIsOpen(true)
          return
        }

        sendEvent('open_donate_action_modal', { hubId, chatId })
        openDonateExtension()
      },
    }
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
    const showDonateMenuItem = canSendMessage && !isMessageOwner

    if (showDonateMenuItem) menus.unshift(donateMenuItem)
    if (pinUnpinMenu) menus.unshift(pinUnpinMenu)
    if (isDatahubAvailable && canSendMessage && isMessageOwner)
      menus.unshift(editItem)
    if (canSendMessage) menus.unshift(replyItem)

    return menus
  }
  const menus = enableChatMenu ? getChatMenus() : []

  return (
    <>
      <FloatingMenus
        beforeMenus={
          isOptimisticMessage
            ? message && <MintingMessageNotice message={message} />
            : currentNetwork === 'subsocial' && (
                <SuperLikeWrapper postId={messageId} withPostReward={false}>
                  {({ isDisabled, handleClick, hasILiked, disabledCause }) => {
                    if (hasILiked) return null
                    const menuList = (
                      <div className='relative w-full'>
                        <MenuList
                          size='sm'
                          menus={[
                            {
                              icon: IoDiamondOutline,
                              text: 'Like Message',
                              disabled: isDisabled,
                              onClick: handleClick,
                            },
                          ]}
                        />
                        <div className='absolute bottom-0 flex w-full flex-col'>
                          <div className='mx-4 h-px bg-border-gray' />
                        </div>
                      </div>
                    )
                    return disabledCause ? (
                      <PopOver
                        triggerClassName='w-full'
                        trigger={menuList}
                        panelSize='sm'
                        triggerOnHover
                        placement='top'
                      >
                        <p>{disabledCause}</p>
                      </PopOver>
                    ) : (
                      menuList
                    )
                  }}
                </SuperLikeWrapper>
              )
        }
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
      <ModerationModal
        isOpen={modalState === 'moderate'}
        closeModal={() => setModalState(null)}
        messageId={messageId}
        chatId={chatId}
        hubId={hubId}
      />
      <HideMessageModal
        isOpen={modalState === 'hide'}
        closeModal={() => setModalState(null)}
        messageId={messageId}
        chatId={chatId}
        hubId={hubId}
      />
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
