import Alberdioni from '@/assets/graphics/landing/testimonials/alberdioni8406.png'
import DogStreet from '@/assets/graphics/landing/testimonials/dogstreet.png'
import Edmond22 from '@/assets/graphics/landing/testimonials/edmond22.png'
import Gbrady12 from '@/assets/graphics/landing/testimonials/gbrady12.png'
import Marta from '@/assets/graphics/landing/testimonials/marta.png'
import Wavingood from '@/assets/graphics/landing/testimonials/wavingood.png'
import { cx } from '@/utils/class-names'
import { EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image, { ImageProps } from 'next/image'
import React, {
  ComponentProps,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Heading from '../common/Heading'

const testimonials: {
  image: ImageProps['src']
  name: string
  text: string
  className: string
}[] = [
  {
    image: Edmond22,
    name: 'Edmond22',
    text: `Awesome...i just joined the platform and im loving the energy here.
What a great time!😎👌`,
    className: 'row-span-3',
  },
  {
    image: Gbrady12,
    name: 'G.Brady12',
    text: `I already have 3 friends that I brought here because they asked me things that they can now read and learn for themselves.
For me the best is undoubtedly the information that can be found here in an easy way if advertising at the moment and without distractions for me that is what has the most value.`,
    className: 'row-span-4',
  },
  {
    image: Alberdioni,
    name: 'alberdioni8406',
    text: `PV is an excellent app to creators and to regular readers. Creators can monetize (after staking some SUB) their work forever with the reward split feature and readers can earn from their engagement on the platforms as each like of them can bring infinite rewards all this in a Decentralized manner. 👈 Is an argument that I can use to explain others how good and powerful the PV can be`,
    className: 'row-span-6',
  },
  {
    image: Marta,
    name: 'Marta',
    text: `So glad to be a part of such a cool community! Subsocial grows and develops 🚀 Between December 22 to January 22 Subsocial have had an over 25% growth in engagement 💪🏻
The team conducted 8 contests and giveaways and rewarded 35 Subbers with 47,500 SUB 🔥
Over 10 Subbers have also earned up to 7,000 SUB for simply engaging in discussions and giving valuable feedback 😍. It's incredible, but further - more!`,
    className: 'row-span-6',
  },
  {
    image: Wavingood,
    name: 'Wavin Good',
    text: `A huge shoutout to you and the rest of the team for all your commitment to users feedback, ser. This kind of community engagement is what makes polkaverse so special.`,
    className: 'row-span-3',
  },
  {
    image: DogStreet,
    name: 'Dog Street',
    text: `I earned 668 SUB yesterday on Subsocial!

Being a part of The Creator Economy is great!`,
    className: 'row-span-2',
  },
]

export default function CommunitySection(props: ComponentProps<'section'>) {
  return (
    <section className={cx('mx-auto max-w-6xl', props.className)}>
      <Heading className='mb-10'>
        What Our Community Says About Grill.so
      </Heading>
      <div className='hidden grid-cols-[3fr_4fr] gap-7 md:grid'>
        {testimonials.map((t) => (
          <TestimonialCard {...t} key={t.name} />
        ))}
      </div>
      <TestimonialCarousel className='md:hidden' />
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
        <Image src={image} className='h-10 w-10 lg:h-14 lg:w-14' alt='' />
        <span className='text-2xl font-medium'>{name}</span>
      </div>
      <p className='whitespace-pre-wrap text-lg md:text-xl'>{text}</p>
    </div>
  )
}

function TestimonialCarousel({ className }: { className?: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  return (
    <div className={cx('overflow-hidden', className)} ref={emblaRef}>
      <div className='flex'>
        {testimonials.map(({ className: _, ...t }) => (
          <div className='mr-6 flex-[0_0_100%]' key={t.name}>
            <TestimonialCard className='h-full' {...t} />
          </div>
        ))}
      </div>

      <div className='mx-auto mt-6 flex max-w-max appearance-none gap-2.5 rounded-full bg-white/5 p-2.5'>
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            isActive={index === selectedIndex}
          />
        ))}
      </div>
    </div>
  )
}

type DotProps = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    isActive?: boolean
  }
>

export const DotButton: React.FC<DotProps> = (props) => {
  const { children, isActive, ...restProps } = props

  return (
    <button
      type='button'
      {...restProps}
      className={cx(
        'h-2.5 w-2.5 rounded-full bg-white/50 transition-all duration-300',
        isActive && 'w-8 bg-[#EC7930]',
        restProps.className
      )}
    >
      {children}
    </button>
  )
}

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  }
}
