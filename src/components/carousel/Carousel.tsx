import { cx } from '@/utils/class-names'
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import React, { ReactNode, useCallback } from 'react'
import { DotButton, useDotButton } from './CarouselDotButton'

type PropType = {
  slides: ReactNode[]
  options?: EmblaOptionsType
  className?: string
}

const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ])

  const onButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const { autoplay } = emblaApi.plugins()
    if (!autoplay) return
    if (autoplay.options.stopOnInteraction !== false) autoplay.stop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onButtonClick
  )

  return (
    <div className={cx('relative', props.className)}>
      <div className={cx('overflow-hidden')} ref={emblaRef}>
        <div
          className={cx('flex touch-pan-y')}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {slides.map((slide, index) => (
            <div
              className='relative min-w-0 flex-shrink-0 flex-grow-0 basis-full'
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div
        className={cx(
          'absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-2'
        )}
      >
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={index === selectedIndex ? 'opacity-100' : 'opacity-30'}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
