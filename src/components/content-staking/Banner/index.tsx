import LinkText from '@/components/LinkText'
import SkeletonFallback from '@/components/SkeletonFallback'
import BgGradient from '@/modules/LandingPage/common/BgGradient'
import { useContentStakingContext } from '../utils/ContentStakingContext'
import SectionWrapper from '../utils/SectionWrapper'
import BannerActionButtons from './BannerActionButtons'
import StatsCards from './StakerDashboard'
import StakingStepper from './StakingStepper'

const BannerSection = () => {
  const { isLockedTokens, ledgerLoading } = useContentStakingContext()

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex w-full flex-col gap-3'>
        <div className='flex items-center justify-between gap-2'>
          <div className='font-unbounded font-extrabold leading-none text-[32px] text-text'>
            Content Staking
          </div>
        </div>
        <div className='text-xl font-normal leading-6 text-slate-300'>
          Content Staking allows SUB token holders to earn SUB by actively
          engaging with good content on the network.{' '}
          <LinkText variant='primary' className='hover:no-underline' href={''}>
            How does it work?
          </LinkText>
        </div>
      </div>
      <SectionWrapper className='relative z-[1] flex flex-col items-center gap-4 p-4 md:gap-5'>
        <BgGradient
          color='dark-blue'
          className='absolute left-[80px] top-[55px] z-0 h-[731px] w-[731px] -translate-x-full'
        />

        <SkeletonFallback
          className='h-[181px] w-full rounded-2xl'
          isLoading={ledgerLoading}
        >
          {isLockedTokens ? <StatsCards /> : <StakingStepper />}
          <div>
            <BannerActionButtons />
          </div>
        </SkeletonFallback>
      </SectionWrapper>
    </div>
  )
}

export default BannerSection
