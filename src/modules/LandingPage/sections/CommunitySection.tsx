import Alberdioni from '@/assets/graphics/landing/testimonials/alberdioni8406.png'
import DogStreet from '@/assets/graphics/landing/testimonials/dogstreet.png'
import Edmond22 from '@/assets/graphics/landing/testimonials/edmond22.png'
import Gbrady12 from '@/assets/graphics/landing/testimonials/gbrady12.png'
import Marta from '@/assets/graphics/landing/testimonials/marta.png'
import Wavingood from '@/assets/graphics/landing/testimonials/wavingood.png'
import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { ComponentProps } from 'react'

export default function CommunitySection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('mx-auto max-w-6xl', props.className)}>
      <h3 className='mb-10 text-center text-5xl font-bold'>
        What Our Community Says About Grill.so
      </h3>
      <div className='grid grid-cols-[2fr_3fr] gap-7'>
        <TestimonialCard
          className='row-span-3'
          image={Edmond22}
          name='Edmond22'
          text={`Awesome...i just joined the platform and im loving the energy here.
What a great time!😎👌`}
        />
        <TestimonialCard
          className='row-span-4'
          image={Gbrady12}
          name='G.Brady12'
          text={`I already have 3 friends that I brought here because they asked me things that they can now read and learn for themselves.
For me the best is undoubtedly the information that can be found here in an easy way if advertising at the moment and without distractions for me that is what has the most value.`}
        />
        <TestimonialCard
          className='row-span-6'
          image={Alberdioni}
          name='alberdioni8406'
          text={`PV is an excellent app to creators and to regular readers. Creators can monetize (after staking some SUB) their work forever with the reward split feature and readers can earn from their engagement on the platforms as each like of them can bring infinite rewards all this in a Decentralized manner. 👈 Is an argument that I can use to explain others how good and powerful the PV can be`}
        />
        <TestimonialCard
          className='row-span-6'
          image={Marta}
          name='Marta'
          text={`So glad to be a part of such a cool community! Subsocial grows and develops 🚀 Between December 22 to January 22 Subsocial have had an over 25% growth in engagement 💪🏻

The team conducted 8 contests and giveaways and rewarded 35 Subbers with 47,500 SUB 🔥
Over 10 Subbers have also earned up to 7,000 SUB for simply engaging in discussions and giving valuable feedback 😍
It's incredible, but further - more!`}
        />
        <TestimonialCard
          className='row-span-3'
          image={Wavingood}
          name='Wavin Good'
          text={`A huge shoutout to you and the rest of the team for all your commitment to users feedback, ser. This kind of community engagement is what makes polkaverse so special.`}
        />
        <TestimonialCard
          className='row-span-2'
          image={DogStreet}
          name='Dog Street'
          text={`I earned 668 SUB yesterday on Subsocial!

Being a part of The Creator Economy is great!`}
        />
      </div>
    </section>
  )
}

function TestimonialCard({
  image,
  name,
  text,
  className,
}: {
  image: ImageProps['src']
  name: string
  text: string
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex flex-col gap-4 rounded-3xl bg-white/5 p-5',
        className
      )}
    >
      <div className='flex items-center gap-4'>
        <Image src={image} className='h-14 w-14' alt='' />
        <span className='text-2xl font-medium'>{name}</span>
      </div>
      <p className='whitespace-pre-wrap text-xl'>{text}</p>
    </div>
  )
}
