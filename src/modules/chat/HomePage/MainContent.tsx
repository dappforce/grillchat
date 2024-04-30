import EpicTokenIllust from '@/assets/graphics/epic-token-illust.svg'
import FarcasterLogo from '@/assets/logo/farcaster.svg'
import GalxeLogo from '@/assets/logo/galxe.svg'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { HiOutlineInformationCircle } from 'react-icons/hi2'

export default function MainContent() {
  return (
    <div className='flex flex-col gap-8 pt-4'>
      <GuestCard />
      <div className='flex flex-col gap-4 @container'>
        <span className='text-lg font-semibold'>Earn more points</span>
        <div className='grid grid-cols-1 gap-4 @lg:grid-cols-2'>
          <Card className='relative flex flex-col bg-[#8A63D20D]'>
            <FarcasterLogo className='absolute right-2 top-2 text-5xl text-[#8A63D2]' />
            <div className='mb-1 flex items-center gap-2'>
              <span className='font-semibold'>Farcaster Memes</span>
              <HiOutlineInformationCircle className='text-text-muted' />
            </div>
            <p className='mb-4 pr-10 text-sm text-text-muted'>
              You earn points every time your memes are liked.
            </p>
            <Button variant='primaryOutline' className='font-medium'>
              Earn on Farcaster
            </Button>
          </Card>
          <Card className='relative flex flex-col bg-[#1D5AF70D]'>
            <GalxeLogo className='absolute right-2 top-2 text-4xl text-[#1D5AF7]' />
            <div className='mb-1 flex items-center gap-2'>
              <span className='font-semibold'>Galxe Quests</span>
              <HiOutlineInformationCircle className='text-text-muted' />
            </div>
            <p className='mb-4 pr-10 text-sm text-text-muted'>
              Earn points by completing tasks on Galxe.
            </p>
            <Button variant='primaryOutline' className='font-medium'>
              Earn on Galxe
            </Button>
          </Card>
        </div>
        <Card className='flex flex-col gap-1 bg-white'>
          <div className='mb-1 flex items-center gap-2'>
            <span className='font-semibold'>Earn With Friends</span>
            <HiOutlineInformationCircle className='text-text-muted' />
          </div>
          <p className='text-sm text-text-muted'>
            Earn points when your friends join Epic using your link.
          </p>
        </Card>
      </div>
    </div>
  )
}

function GuestCard() {
  return (
    <Card
      className='relative flex flex-col items-start overflow-clip bg-background-primary pt-3 text-white @container'
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top right, #7996F9, #2756F5)',
      }}
    >
      <div className='mb-1 flex w-full items-center justify-between'>
        <span className='text-lg font-semibold'>Meme2earn</span>
        <Button variant='transparent' className='bg-white/10'>
          How does it work?
        </Button>
      </div>
      <p className='mb-4 max-w-96 font-medium'>
        Start monetizing your best memes, and earn when you like posts from
        others!
      </p>
      <Button variant='white'>Start earning</Button>
      <EpicTokenIllust className='pointer-events-none absolute -bottom-1/4 right-0 w-[125%] min-w-96 translate-x-[40%] @md:w-full @lg:-bottom-1/3' />
    </Card>
  )
}
