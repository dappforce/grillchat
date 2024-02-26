import LinkText from '@/components/LinkText'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { useMyMainAddress } from '@/stores/my-account'
import BN from 'bignumber.js'
import SectionWrapper from '../utils/SectionWrapper'
import BannerActionButtons from './BannerActionButtons'
import StatsCards from './StakerDashboard'
import StakingStepper from './StakingStepper'

const BannerSection = () => {
  const myAddress = useMyMainAddress()

  const { data: ledger, isLoading: ledgerLoading } =
    getBackerLedgerQuery.useQuery(myAddress || '')

  const { locked } = ledger || {}

  const isLockedTokens = !new BN(locked || '0').isZero()

  return (
    <SectionWrapper className='flex flex-col items-center gap-5  p-4'>
      <div className='flex w-full flex-col gap-3'>
        <div className='flex items-center justify-between gap-4'>
          <div className='font-unbounded text-4xl font-extrabold leading-none text-text'>
            Content Staking
          </div>
          <LinkText variant='primary' className='hover:no-underline' href={''}>
            How does it work?
          </LinkText>
        </div>
        <div className='text-base font-normal leading-6 text-slate-300'>
          Content Staking allows SUB token holders to earn more SUB by actively
          engaging with good content on the network.
        </div>
      </div>
      {isLockedTokens ? <StatsCards /> : <StakingStepper />}

      <div>
        <BannerActionButtons />
      </div>
    </SectionWrapper>
  )
}

export default BannerSection
