import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import MenuList from '@/components/MenuList'
import { useName } from '@/components/Name'
import Toast from '@/components/Toast'
import { SuperLikeWrapper } from '@/components/content-staking/SuperLike'
import FloatingMenus, {
  FloatingMenusProps,
} from '@/components/floating/FloatingMenus'
import HideMessageModal from '@/components/modals/HideMessageModal'
import MetadataModal from '@/components/modals/MetadataModal'
import ModerationModal from '@/components/moderation/ModerationModal'
import { sendEventWithRef } from '@/components/referral/analytics'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import useIsOwnerOfPost from '@/hooks/useIsOwnerOfPost'
import useRerender from '@/hooks/useRerender'
import useToastError from '@/hooks/useToastError'
import { getPostQuery } from '@/services/api/query'
import { getSocialProfileQuery } from '@/services/datahub/identity/query'
import { useModerationActions } from '@/services/datahub/moderation/mutation'
import { getModerationReasonsQuery } from '@/services/datahub/moderation/query'
import { useApproveUser } from '@/services/datahub/posts/mutation'
import { usePinMessage } from '@/services/subsocial/posts/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useChatMenu } from '@/stores/chat-menu'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { estimatedWaitTime } from '@/utils/network'
import { copyToClipboard } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import { ImageProperties, PostData } from '@subsocial/api/types'
import { SocialCallDataArgs } from '@subsocial/data-hub-sdk'
import { useEffect, useState } from 'react'
import { BsFillPinAngleFill } from 'react-icons/bs'
import { FaCheck } from 'react-icons/fa6'
import {
  HiChevronRight,
  HiMiniArrowUturnLeft,
  HiOutlineEyeSlash,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'
import { IoDiamondOutline } from 'react-icons/io5'
import { LuShield } from 'react-icons/lu'
import { MdContentCopy } from 'react-icons/md'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'
import usePinnedMessage from '../hooks/usePinnedMessage'

export type ChatItemMenusProps = {
  messageId: string
  menuIdPrefix?: string
  chatId: string
  hubId: string
  children: FloatingMenusProps['children']
  enableChatMenu?: boolean
}

type ModalState = 'metadata' | 'moderate' | 'hide' | null

export default function ChatItemMenus({
  messageId,
  menuIdPrefix,
  children,
  chatId,
  hubId,
  enableChatMenu = true,
}: ChatItemMenusProps) {
  const myAddress = useMyMainAddress()

  const menuId = `${menuIdPrefix || ''}${messageId}`
  const isOpen = useChatMenu((state) => state.openedChatId === menuId)
  const setIsOpenChatMenu = useChatMenu((state) => state.setOpenedChatId)
  const isMessageOwner = useIsOwnerOfPost(messageId)

  const { data: post } = getPostQuery.useQuery(messageId)
  const ownerId = post?.struct.ownerId ?? ''
  const { ref, inView } = useInView({ triggerOnce: true })

  const isAdmin = useIsModerationAdmin()
  const { data: socialProfile, isLoading: loadingSocialProfile } =
    getSocialProfileQuery.useQuery(ownerId, {
      enabled: inView && isAdmin,
    })
  const { mutate: approveUser } = useApproveUser()

  const { data: message } = getPostQuery.useQuery(messageId)
  const [modalState, setModalState] = useState<ModalState>(null)

  const { mutate: moderate } = useModerateWithSuccessToast(messageId, chatId)

  const sendEvent = useSendEvent()

  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const { data: reasons } = getModerationReasonsQuery.useQuery(null)
  const firstReasonId = reasons?.[0].id

  const { dataType } = message?.struct || {}

  const isOptimisticMessage = !dataType

  const pinUnpinMenu = usePinUnpinMenuItem(chatId, messageId)
  const getChatMenus = (): FloatingMenusProps['menus'] => {
    const menus: FloatingMenusProps['menus'] = []

    const hideMenu: FloatingMenusProps['menus'][number] = {
      text: 'Hide',
      icon: HiOutlineEyeSlash,
      onClick: () => setModalState('hide'),
    }
    if (isMessageOwner && !isOptimisticMessage) menus.unshift(hideMenu)

    if (isAuthorized) {
      menus.unshift({
        icon: LuShield,
        text: 'Moderate ...',
        onClick: () => {
          sendEvent('open_moderate_action_modal', { hubId, chatId })
          setModalState('moderate')
        },
      })
      menus.unshift({
        icon: LuShield,
        text: 'Block message',
        onClick: () => {
          sendEvent('block_message', { hubId, chatId })
          moderate({
            callName: 'synth_moderation_block_resource',
            args: {
              reasonId: firstReasonId,
              resourceId: messageId,
              ctxPostIds: ['*'],
              ctxAppIds: ['*'],
            },
            chatId: chatId ?? '',
          })
        },
      })
      menus.unshift({
        icon: LuShield,
        text: 'Block user',
        onClick: () => {
          sendEvent('block_user', { hubId, chatId })
          moderate({
            callName: 'synth_moderation_block_resource',
            args: {
              reasonId: firstReasonId,
              resourceId: ownerId,
              ctxPostIds: ['*'],
              ctxAppIds: ['*'],
            },
            chatId,
          })
        },
      })
      if (
        !loadingSocialProfile &&
        !socialProfile?.allowedCreateCommentRootPostIds.includes(chatId)
      ) {
        menus.unshift({
          text: 'Approve User',
          icon: FaCheck,
          onClick: () => {
            sendEvent('approve_user', { hubId, chatId })
            approveUser({
              address: ownerId,
              allow: { createCommentRootPostIds: [chatId] },
            })
          },
        })
      }
    }

    if (isOptimisticMessage) return menus

    if (pinUnpinMenu) menus.unshift(pinUnpinMenu)

    return menus
  }
  const menus =
    enableChatMenu && (message?.struct.ownerId === myAddress || isAuthorized)
      ? getChatMenus()
      : []

  return (
    <>
      <FloatingMenus
        preventOnClickOpen
        beforeMenus={
          !isOptimisticMessage && (
            <SuperLikeWrapper postId={messageId} withPostReward={false}>
              {({ isDisabled, handleClick, hasILiked, disabledCause }) => {
                const menus: FloatingMenusProps['menus'] = []
                if (!hasILiked && !disabledCause) {
                  menus.push({
                    icon: IoDiamondOutline,
                    text: 'Like Message',
                    disabled: isDisabled,
                    onClick: () => {
                      sendEventWithRef(myAddress ?? '', (refId) => {
                        sendEvent(
                          'click_superlike',
                          {
                            eventSource: 'message_menu',
                            postId: messageId,
                          },
                          { ref: refId }
                        )
                      })
                      handleClick()
                      setIsOpenChatMenu(null)
                    },
                  })
                }

                const imageExt = message?.content?.extensions?.find(
                  (ext) => ext.id === 'subsocial-image'
                )
                if (imageExt && isAuthorized) {
                  menus.push({
                    text: 'Copy Image URL',
                    icon: MdContentCopy,
                    onClick: () => {
                      copyToClipboard(
                        getIpfsContentUrl(
                          (imageExt.properties as ImageProperties).image
                        )
                      )
                      toast.custom((t) => (
                        <Toast t={t} title='Image URL copied to clipboard!' />
                      ))
                      setIsOpenChatMenu(null)
                    },
                  })
                }

                const menuList = (
                  <div className='relative w-full'>
                    <MenuList size='sm' menus={menus} />
                    <div className='absolute bottom-0 flex w-full flex-col'>
                      <div className='mx-4 border-b border-border-gray' />
                    </div>
                  </div>
                )
                return menuList
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
          onOpenChange: (isOpen, event) => {
            const closestButton = (
              event?.target as HTMLElement | undefined
            )?.closest('button')
            if (closestButton?.classList.contains('superlike') && isOpen) {
              return
            }
            setIsOpenChatMenu(isOpen ? menuId : null)
          },
        }}
      >
        {children}
      </FloatingMenus>
      <div ref={ref} />
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

export function useModerateWithSuccessToast(messageId: string, chatId: string) {
  const { data: message } = getPostQuery.useQuery(messageId)
  const ownerId = message?.struct.ownerId ?? ''
  const { name } = useName(ownerId)

  const moderationMutation = useModerationActions({
    onSuccess: (_, variables) => {
      if (variables.callName === 'synth_moderation_block_resource') {
        const args =
          variables.args as SocialCallDataArgs<'synth_moderation_block_resource'>
        const isBlockingOwner = args.resourceId === ownerId
        const undo = () =>
          moderationMutation.mutate({
            callName: 'synth_moderation_unblock_resource',
            args: {
              resourceId: args.resourceId,
              ctxPostIds: ['*'],
              ctxAppIds: ['*'],
            },
            chatId,
          })

        toast.custom((t) => (
          <Toast
            t={t}
            icon={(classNames) => (
              <HiOutlineInformationCircle className={classNames} />
            )}
            title={
              <span>
                You have blocked the {!isBlockingOwner ? 'message from ' : ''}
                user {name}
              </span>
            }
            action={
              <LinkText
                onClick={() => {
                  undo()
                  toast.dismiss(t)
                }}
                variant='primary'
                className='flex items-center gap-1 text-sm'
              >
                <HiMiniArrowUturnLeft /> Undo
              </LinkText>
            }
          />
        ))
      } else if (variables.callName === 'synth_moderation_unblock_resource') {
        toast.custom((t) => (
          <Toast
            t={t}
            icon={(classNames) => (
              <HiOutlineInformationCircle className={classNames} />
            )}
            title='Undo moderation success'
          />
        ))
      }
    },
  })
  useToastError(moderationMutation.error, 'Failed to moderate message')

  return moderationMutation
}
