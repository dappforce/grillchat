import DefaultLayout from '@/components/layouts/DefaultLayout'
import ProposalStatus from '@/components/opengov/ProposalStatus'
import VoteSummary from '@/components/opengov/VoteSummary'
import { Proposal } from '@/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { ReactNode } from 'react'
import DesktopProposalDetail from './DesktopProposalDetail'
import MobileProposalDetailPage from './MobileProposalDetail'
import { ProposalDetailContextProvider } from './context'

export type ProposalDetailPageProps = {
  proposal: Proposal
}

export default function ProposalDetailPage(props: ProposalDetailPageProps) {
  return (
    <DefaultLayout
      className='h-screen lg:!h-auto'
      style={{ height: '100svh' }}
      navbarProps={{
        withLargerContainer: true,
        backButtonProps: {
          defaultBackLink: '/opengov',
          forceUseDefaultBackLink: false,
        },
        customContent: ({ backButton, authComponent, notificationBell }) => (
          <div className='flex w-full items-center justify-between gap-4'>
            <NavbarProposalInfo
              backButton={backButton}
              proposal={props.proposal}
            />
            <div className='flex items-center gap-3'>
              {notificationBell}
              {authComponent}
            </div>
          </div>
        ),
      }}
    >
      <ProposalDetailContextProvider proposal={props.proposal}>
        <DesktopProposalDetail {...props} className='hidden lg:grid' />
        <MobileProposalDetailPage {...props} className='lg:hidden' />
      </ProposalDetailContextProvider>
    </DefaultLayout>
  )
}

function NavbarProposalInfo({
  proposal,
  backButton,
}: {
  proposal: Proposal
  backButton: ReactNode
}) {
  return (
    <div className='-ml-2 flex flex-1 items-center'>
      {backButton}
      <div
        className={cx('flex flex-1 items-center gap-2 rounded-none text-left')}
      >
        <VoteSummary proposal={proposal} className='h-10 w-10' size='small' />
        <div className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <span className='line-clamp-1 font-medium'>{proposal.title}</span>
          </div>
          <span className='line-clamp-1 text-xs text-text-muted'>
            {formatBalanceWithDecimals(proposal.requested)} DOT &middot;{' '}
            <ProposalStatus proposal={proposal} />
          </span>
        </div>
      </div>
    </div>
  )
}
