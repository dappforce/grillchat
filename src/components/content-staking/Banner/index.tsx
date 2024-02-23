import StakingBannerImage from '@/assets/graphics/staking-banner-image.svg'
import LinkText from '@/components/LinkText'
import { getBackerLedgerQuery } from '@/services/contentStaking/backerLedger/query'
import { useMyMainAddress } from '@/stores/my-account'
import BN from 'bignumber.js'
import BannerActionButtons from './BannerActionButtons'
import StatsCards from './StakerDashboard'
import SectionWrapper from '../utils/SectionWrapper'

const BannerSection = () => {
  const myAddress = useMyMainAddress()

  const { data: ledger, isLoading: ledgerLoading } =
    getBackerLedgerQuery.useQuery(myAddress || '')

  const { locked } = ledger || {}

  const isLockedTokens = !new BN(locked || '0').isZero()

  return (
    <SectionWrapper className='flex flex-col items-center gap-6 p-4'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-4'>
          <div className='font-unbounded text-4xl font-extrabold leading-none text-text'>
            Content Staking
          </div>
          <LinkText variant='primary' className='hover:no-underline' href={''}>
            How does it work?
          </LinkText>
        </div>
        <div className='text-lg font-medium leading-[26px] text-text-muted'>
          Content Staking allows SUB token holders to earn more SUB by actively
          engaging with good content on the network.
        </div>
      </div>
      {isLockedTokens ? (
        <StatsCards />
      ) : (
        <StakingBannerImage className='w-full max-w-[490px]' />
      )}

      <div>
        <BannerActionButtons />
      </div>
    </SectionWrapper>
  )
}

export default BannerSection
