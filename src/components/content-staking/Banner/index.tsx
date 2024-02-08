import StakingBannerImage from '@/assets/graphics/staking-banner-image.svg'
import Button from '@/components/Button'
import LinkText from '@/components/LinkText'

const BannerSection = () => {
  return (
    <div className='flex flex-col items-center gap-6 rounded-[20px] bg-content-staking-banner p-4'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between gap-4'>
          <div className='font-unbounded text-4xl font-extrabold leading-none text-slate-50'>
            Content Staking
          </div>
          <LinkText variant='primary' className='hover:no-underline' href={''}>
            How does it work?
          </LinkText>
        </div>
        <div className='text-lg font-medium leading-[26px] text-slate-400'>
          Content Staking allows SUB token holders to earn more SUB by actively
          engaging with good content on the network.
        </div>
      </div>
      <StakingBannerImage className='w-full max-w-[490px]' />

      <div className='text-lg font-medium text-slate-50'>
        To start earning from Content Staking, you first nned to get some SUB:
      </div>
      <div>
        <Button variant='primary' size='lg'>
          Get SUB
        </Button>
      </div>
    </div>
  )
}

export default BannerSection
