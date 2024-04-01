import Card from '@/components/Card'
import LinkText from '@/components/LinkText'
import MdRenderer from '@/components/MdRenderer'
import ProfilePreview from '@/components/ProfilePreview'
import { ProposalDetail } from '@/pages/api/opengov/proposals/[id]'
import { cx } from '@/utils/class-names'
import { formatBalanceWithDecimals } from '@/utils/formatBalance'
import { useState } from 'react'
import ProposalDetailModal from './ProposalDetailModal'

export default function ProposalDetailSection({
  proposal,
  className,
}: {
  proposal: ProposalDetail
  className?: string
}) {
  const [isOpenModal, setIsOpenModal] = useState(false)

  return (
    <div className={cx('container-page flex flex-col gap-4', className)}>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <span>{formatBalanceWithDecimals(proposal.requested)} DOT</span>
          <span className='text-text-muted'>≈$3,567.34</span>
        </div>
        <ProfilePreview
          withPolkadotIdentity
          address={proposal.proposer}
          showAddress={false}
          className='gap-1'
          nameClassName='text-sm text-text-muted'
          avatarClassName='h-5 w-5'
        />
      </div>
      <Card className='flex flex-col items-start gap-6 bg-background-light'>
        <h1 className='font-bold'>
          #{proposal.id} <span className='text-text-muted'>&middot;</span>{' '}
          {proposal.title}
        </h1>
        <MdRenderer className='line-clamp-6' source={proposal.content} />
        <LinkText
          variant='secondary'
          href={`/opengov/${proposal.id}#detail`}
          shallow
          onClick={() => setIsOpenModal(true)}
        >
          Read more
        </LinkText>
      </Card>
      <ProposalDetailModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        proposal={proposal}
      />
    </div>
  )
}
