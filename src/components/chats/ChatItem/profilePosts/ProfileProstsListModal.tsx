import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import Name from '@/components/Name'
import useAuthorizedForModeration from '@/hooks/useAuthorizedForModeration'
import { getModerationReasonsQuery } from '@/services/datahub/moderation/query'
import { getPaginatedPostIdsByPostIdAndAccount } from '@/services/datahub/posts/queryByAccount'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { Transition } from '@headlessui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import SkeletonFallback from '../../../SkeletonFallback'
import { useModerateWithSuccessToast } from '../ChatItemMenus'
import ProfilePostsList from './ProfilePostsList'

type ProfilePostsListModalProps = {
  address: string
  children: (
    onClick: (e: { stopPropagation: () => void }) => void
  ) => React.ReactNode
  messageId: string
  chatId: string
  hubId: string
}

const ProfilePostsListModalWrapper = ({
  children,
  address,
  messageId,
  chatId,
  hubId,
}: ProfilePostsListModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: moderate } = useModerateWithSuccessToast(messageId, chatId)
  const sendEvent = useSendEvent()
  const { isAuthorized } = useAuthorizedForModeration(chatId)
  const client = useQueryClient()

  const { data: reasons } = getModerationReasonsQuery.useQuery(null)
  const firstReasonId = reasons?.[0].id

  const { data, isLoading } =
    getPaginatedPostIdsByPostIdAndAccount.useInfiniteQuery(chatId, address)

  const totalPostsCount = data?.pages[0].totalData || 0

  const onBlockUserClick = () => {
    sendEvent('block_user', { hubId, chatId })
    moderate({
      callName: 'synth_moderation_block_resource',
      args: {
        reasonId: firstReasonId,
        resourceId: address,
        ctxPostIds: ['*'],
        ctxAppIds: ['*'],
      },
      chatId,
    })
  }

  return (
    <>
      {children((e) => {
        e.stopPropagation()
        setIsOpen(true)
      })}
      {createPortal(
        <>
          <Transition
            appear
            show={isOpen}
            className='fixed inset-0 z-10 h-full w-full bg-background transition duration-300'
            enterFrom={cx('opacity-0')}
            enterTo='opacity-100'
            leaveFrom='h-auto'
            leaveTo='opacity-0 !duration-150'
          />
          <Transition
            appear
            show={isOpen}
            className='fixed inset-0 z-10 flex h-full w-full flex-col bg-background pb-20 transition duration-300'
            enterFrom={cx('opacity-0 -translate-y-48')}
            enterTo='opacity-100 translate-y-0'
            leaveFrom='h-auto'
            leaveTo='opacity-0 -translate-y-24 !duration-150'
          >
            <div className='mx-auto flex w-full max-w-screen-md flex-1 flex-col overflow-auto'>
              <div className='relative mx-auto flex w-full items-center justify-between gap-2 px-4 py-4'>
                <div className='flex flex-1 items-center gap-2'>
                  <Button
                    variant='transparent'
                    size='circle'
                    className='min-w-[auto]'
                    onClick={() => {
                      setIsOpen(false)
                    }}
                  >
                    <HiOutlineChevronLeft />
                  </Button>
                  <AddressAvatar
                    address={address}
                    className='flex-shrink-0 cursor-pointer'
                  />
                  <div className='flex flex-col gap-1'>
                    <Name address={address} className='!text-text' clipText />
                    <span className='flex items-center gap-1 text-xs font-medium leading-[normal] text-slate-400'>
                      <span>Memes:</span>
                      <SkeletonFallback
                        isLoading={isLoading}
                        className='my-0 w-fit min-w-8'
                      >
                        {totalPostsCount}
                      </SkeletonFallback>
                    </span>
                  </div>
                </div>

                {isAuthorized && (
                  <Button
                    size='md'
                    variant='redOutline'
                    className='w-fit text-red-400'
                    onClick={onBlockUserClick}
                  >
                    Block user
                  </Button>
                )}
              </div>
              <div className='relative mx-auto flex h-full max-h-full min-h-[400px] w-full flex-col items-center px-4'>
                <ProfilePostsList
                  address={address}
                  chatId={chatId}
                  hubId={hubId}
                />
              </div>
            </div>
          </Transition>
        </>,
        document.body
      )}
    </>
  )
}

export default ProfilePostsListModalWrapper
