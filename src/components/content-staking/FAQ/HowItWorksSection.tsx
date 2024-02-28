import BgGradient from '@/modules/LandingPage/common/BgGradient'

const HowItWorksSection = () => {
  return (
    <div className='relative z-[1] flex w-full flex-col items-center gap-4'>
      <BgGradient
        color='pink'
        className='absolute left-[171px] top-[40px] z-0 h-[740px] w-[740px] translate-x-full'
      />
      <div className='flex w-full flex-col items-center gap-2'>
        <div className='text-[28px] font-bold leading-none'>
          How does it work?
        </div>
        <div className='text-base font-normal leading-[22px] text-slate-300'>
          Watch a quick video tutorial:
        </div>
      </div>
      <div className='flex w-full justify-center'>
        <iframe
          width='auto'
          height='auto'
          src='https://www.youtube.com/embed/dQw4w9WgXcQ?si=6LwW0mYXO6qO6eTU'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          className='h-[372px] w-full max-w-2xl rounded-2xl'
        ></iframe>
      </div>
    </div>
  )
}

export default HowItWorksSection
