import CoinsImage from '@/assets/graphics/coins.png'
import Button from '@/components/Button'
import Image from 'next/image'

type IncreaseStakeBannerProps = {
  address: string
}

const IncreaseStakeBanner = ({ address }: IncreaseStakeBannerProps) => {
  return (
    <div className='relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-2xl bg-[#4F46E5] p-6 pl-[65px] backdrop-blur-xl'>
      <Image
        src={CoinsImage}
        alt=''
        className='rotate-y-180 absolute bottom-auto left-[-26px] top-auto max-h-[72px] w-full max-w-[82px] '
      />
      <div className='flex flex-col gap-2'>
        <span className='text-base font-semibold leading-normal'>
          Increase your daily rewards by locking more SUB
        </span>
        <span className='text-xs font-medium text-text-muted'>
          You can lock 5,139.35 more SUB to increase your future rewards
        </span>
      </div>
      <Button href='/staking' size='md' className='bg-white text-black'>
        Lock SUB
      </Button>
    </div>
  )
}

export default IncreaseStakeBanner
