import Button from '@/components/Button'
import ChatRoom from '@/components/chats/ChatRoom'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import BottomPanel from '@/modules/chat/ChatPage/BottomPanel'
import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { ReactNode, useState } from 'react'
import ProposalDetailModal from './ProposalDetailModal'
import ProposalDetailSection from './ProposalDetailSection'

export type ProposalDetailPageProps = {
  proposal: Proposal
}

export default function ProposalDetailPage({
  proposal,
}: ProposalDetailPageProps) {
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
        <div className='absolute left-0 z-10 hidden h-[calc(100dvh_-_3.5rem)] overflow-auto pb-8 pl-4 pt-4 scrollbar-none lg:block [@media(min-width:1300px)]:left-[calc((100%_-_1300px)_/_2)]'>
          <ProposalDetailSection proposal={proposal} className='w-[400px]' />
        </div>
        <ChatRoom
          chatId='88716'
          hubId='12466'
          asContainer
          withDesktopLeftOffset={424}
        />
        <BottomPanel withDesktopLeftOffset={424} />
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
