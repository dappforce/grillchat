import Diamond from '@/assets/emojis/diamond.png'
import Telegram from '@/assets/graphics/tasks/telegram.png'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'
import useToastError from '@/hooks/useToastError'
import { GamificationTask } from '@/services/datahub/tasks'
import { useClaimTaskTokens } from '@/services/datahub/tasks/mutation'
import { getGamificationTasksErrorQuery } from '@/services/datahub/tasks/query'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { formatNumber } from '@/utils/strings'
import { Transition } from '@headlessui/react'
import { useQueryClient } from '@tanstack/react-query'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import { HiXMark } from 'react-icons/hi2'
import TasksRewardsModal from './TasksRewardsModal'

export type ClaimModalVariant = 'epic-telegram' | null

export const claimTaskErrorStore = new LocalStorage(() => 'claim-tasks-error')

type ModalConfig = {
  image: StaticImageData
  steps: React.ReactNode[]
  tag: string
}

export const modalConfigByVariant: Record<
  Exclude<ClaimModalVariant, null>,
  ModalConfig
> = {
  'epic-telegram': {
    image: Telegram,
    tag: 'JOIN_TELEGRAM_CHANNEL_EpicAppNet',
    steps: [
      <div key='join-channel' className='flex flex-col gap-3'>
        <span className='text-sm font-medium leading-none text-slate-200'>
          Join the channel:
        </span>
        <LinkText
          href='https://t.me/EpicAppNet'
          variant='primary'
          className='flex items-center gap-2 leading-none'
        >
          @EpicAppNet <FiArrowUpRight />
        </LinkText>
      </div>,
      <span key='claim-click' className='text-sm font-medium text-slate-200'>
        Click the button below to verify your task
      </span>,
    ],
  },
}

type ClaimTasksTokensModalProps = {
  modalVariant: ClaimModalVariant
  close: () => void
  data: GamificationTask[]
}

const ClaimTasksTokensModal = ({
  modalVariant,
  close,
  data,
}: ClaimTasksTokensModalProps) => {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false)
  const client = useQueryClient()
  const [loading, setLoading] = useState(false)

  const { data: claimTaskTokensError } =
    getGamificationTasksErrorQuery.useQuery('error')
  const closeModal = () => {
    setIsOpenAnimation(false)
    close()
  }

  const isOpen = !!modalVariant

  const variant = modalVariant || 'epic-telegram'

  const { image: taskImage, steps, tag } = modalConfigByVariant[variant]

  const task = data?.find((task) => task.tag === tag)

  const reward = formatNumber(parseInt(task?.rewardPoints ?? '0'))

  const {
    mutate: claimTaskTokens,
    error,
    isLoading: isClaimLoading,
  } = useClaimTaskTokens()

  useEffect(() => {
    if (!!claimTaskTokensError?.error) setLoading(false)

    if (claimTaskTokensError?.error === 'None') {
      setIsOpenAnimation(true)
    }
  }, [claimTaskTokensError?.error])

  useToastError(error, 'Failed to claim task tokens')

  return createPortal(
    <>
      <Transition
        show={isOpen}
        appear
        className='fixed inset-0 z-40 h-full w-full bg-black/50 backdrop-blur-md transition duration-300'
        enterFrom={cx('opacity-0')}
        enterTo='opacity-100'
        leaveFrom='h-auto'
        leaveTo='opacity-0 !duration-150'
        onClick={close}
      />
      {isOpenAnimation && isOpen && (
        <TasksRewardsModal reward={reward} close={closeModal} />
      )}
      <Transition
        show={isOpen && !isOpenAnimation}
        appear
        className='fixed bottom-0 left-1/2 z-40 mx-auto flex h-auto w-full max-w-screen-md -translate-x-1/2 rounded-t-[10px] bg-background-light outline-none transition duration-300'
        enterFrom={cx('opacity-0 translate-y-48')}
        enterTo='opacity-100 translate-y-0'
        leaveFrom='h-auto'
        leaveTo='opacity-0 translate-y-24 !duration-150'
      >
        <Button
          size='circleSm'
          variant='transparent'
          className='absolute right-4 top-4'
          onClick={close}
        >
          <HiXMark className='text-lg' />
        </Button>
        <div className='mx-auto flex w-full max-w-screen-md flex-col gap-6 overflow-auto px-5 py-6 pb-12'>
          <div className='flex flex-col gap-2'>
            <span className='text-2xl font-medium'>Tasks</span>
          </div>
          <div className='flex w-full flex-col gap-6'>
            <div className='flex w-full flex-col items-center gap-6'>
              <Image src={taskImage} alt='' className='h-[100px] w-[100px]' />
              <span className='flex items-center gap-1 text-lg font-medium leading-none'>
                <Image src={Diamond} alt='' className='h-6 w-6' /> +{reward}
              </span>
              <span className='text-[22px] font-bold leading-none'>
                Join Our Telegram Channel
              </span>
            </div>
            <div className='flex flex-col gap-6 rounded-[20px] bg-slate-700 p-4'>
              {steps.map((step, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div
                    className={cx(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      'border border-slate-500 bg-slate-600 font-bold'
                    )}
                  >
                    {index + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
            <Button
              variant='primary'
              size='lg'
              isLoading={isClaimLoading || loading}
              onClick={async () => {
                setLoading(true)
                getGamificationTasksErrorQuery.setQueryData(
                  client,
                  'error',
                  () => {
                    return { error: 'error' }
                  }
                )

                claimTaskTokens({ taskTag: tag })
              }}
            >
              Check the task
            </Button>
          </div>
        </div>
      </Transition>
    </>,
    document.body
  )
}

export default ClaimTasksTokensModal
