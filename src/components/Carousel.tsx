import { cx } from '@/utils/class-names'
import { useEffect, useState } from 'react'

const defaultAutoplaySpeed = 5000

type CarouselProps = {
  autoplay?: boolean
  autoplaySpeed?: number
  pauseOnHover?: boolean
  items: React.ReactNode[]
  dots?: boolean
  className?: string
}

const Carousel = ({
  items,
  className,
  dots,
  autoplay,
  autoplaySpeed,
  pauseOnHover,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined

    if (autoplay) {
      intervalId = setInterval(() => {
        if (pauseOnHover && isHovered) return
        setCurrentIndex((index) => {
          const newIndex = index >= items.length - 1 ? 0 : index + 1

          return newIndex
        })
      }, autoplaySpeed || defaultAutoplaySpeed)
    }

    return () => {
      intervalId && clearInterval(intervalId)
    }
  }, [isHovered])

  const onMouseEnter = () => {
    setIsHovered(true)
  }

  const onMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cx('relative overflow-hidden', className)}
    >
      <div
        className={`duration-40 flex transition ease-out`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item, i) => {
          return (
            <div className='min-w-full' key={i}>
              {item}
            </div>
          )
        })}
      </div>

      {dots && items.length > 1 && (
        <div className='absolute bottom-[18px] flex w-full justify-center gap-3'>
          {items.map((_, i) => {
            return (
              <div
                onClick={() => {
                  setCurrentIndex(i)
                }}
                key={'circle' + i}
                className={cx(
                  'h-[9px] w-[9px] cursor-pointer rounded-full bg-black/60',
                  { ['opacity-30']: i !== currentIndex }
                )}
              ></div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Carousel
