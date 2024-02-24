import SectionWrapper from '../utils/SectionWrapper'

const HowItWorksSection = () => {
  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <div className='flex w-full flex-col items-center gap-2'>
        <div className='text-2xl font-bold leading-none text-text'>
          How does it work
        </div>
        <div className='text-sm font-normal leading-[22px] text-text-muted'>
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
