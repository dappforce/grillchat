import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import BottomPanel from '@/modules/chat/ChatPage/BottomPanel'
import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { ReactNode, memo, useState } from 'react'
import { HiChevronUp } from 'react-icons/hi2'
import ProposalDetailModal from './ProposalDetailModal'
import ProposalDetailSection from './ProposalDetailSection'

export type ProposalDetailPageProps = {
  proposal: Proposal
}

const MemoizedChatRoom = memo(ChatRoom)

export default function ProposalDetailPage({
  proposal,
}: ProposalDetailPageProps) {
  const [isOpenComment, setIsOpenComment] = useState(false)

  return (
    <DefaultLayout
      withFixedHeight
      navbarProps={{
        withLargerContainer: true,
        backButtonProps: {
          defaultBackLink: '/opengov',
          forceUseDefaultBackLink: false,
        },
        customContent: ({ backButton, authComponent, notificationBell }) => (
          <div className='flex w-full items-center justify-between gap-4 overflow-hidden'>
            <NavbarChatInfo backButton={backButton} proposal={proposal} />
            <div className='flex items-center gap-3'>
              {notificationBell}
              {authComponent}
            </div>
          </div>
        ),
      }}
    >
      <div className='relative flex flex-1 flex-col overflow-hidden'>
        <div
          className={cx(
            'absolute left-0 z-20 w-full bg-background transition scrollbar-none lg:w-auto [@media(min-width:1300px)]:left-[calc((100%_-_1300px)_/_2)]',
            isOpenComment && 'pointer-events-none -translate-y-1/4 opacity-0'
          )}
        >
          <div className='h-[calc(100dvh_-_3.5rem)] overflow-auto px-4 pb-24 pt-4 lg:pb-8'>
            <ProposalDetailSection
              proposal={proposal}
              className='lg:w-[400px]'
            />
          </div>
          <div className='container-page absolute bottom-0 h-20 w-full border-t border-border-gray bg-background-light py-4 lg:hidden'>
            <Button
              size='lg'
              className='w-full'
              onClick={() => setIsOpenComment(true)}
            >
              Comment (6)
            </Button>
          </div>
        </div>
        <div className='w-full border-b border-border-gray bg-background-light lg:hidden'>
          <Button
            size='noPadding'
            variant='transparent'
            className='flex h-10 w-full items-center justify-center gap-2 text-sm text-text-muted'
            interactive='none'
            onClick={() => setIsOpenComment(false)}
          >
            <span>Back to proposal</span>
            <HiChevronUp />
          </Button>
        </div>
        <MemoizedChatRoom
          chatId='88716'
          hubId='12466'
          asContainer
          withDesktopLeftOffset={416}
        />
        <BottomPanel withDesktopLeftOffset={416} />
      </div>
    </DefaultLayout>
  )
}

function NavbarChatInfo({
  proposal,
  backButton,
}: {
  proposal: Proposal
  backButton: ReactNode
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <div className='flex flex-1 items-center overflow-hidden'>
      {backButton}
      <Button
        variant='transparent'
        interactive='none'
        size='noPadding'
        className={cx(
          'flex flex-1 cursor-pointer items-center gap-2 overflow-hidden rounded-none text-left'
        )}
        onClick={() => {
          setIsOpenModal(true)
        }}
      >
        <VoteSummary
          proposal={proposal}
          className='h-10 w-10'
          type='small'
          cutout={15}
        />
        <div className='flex flex-col overflow-hidden'>
          <div className='flex items-center gap-2 overflow-hidden'>
            <span className='overflow-hidden overflow-ellipsis whitespace-nowrap font-medium'>
              {proposal.title}
            </span>
          </div>
          <span className='overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-text-muted'>
            {formatBalanceWithDecimals(proposal.requested)} DOT &middot;{' '}
            <ProposalStatus proposal={proposal} />
          </span>
        </div>
      </Button>
      <ProposalDetailModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        proposal={proposal}
      />
    </div>
  )
}
