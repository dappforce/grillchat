import WaiterImage from '@/assets/graphics/waiter.png'
import { cx } from '@/utils/class-names'
import { useHapticFeedback } from '@tma.js/sdk-react'
import Image from 'next/image'
import { TouchEvent, TouchList, useEffect, useRef, useState } from 'react'

type PointsClickerProps = {
  className?: string
}

const PointsClicker = ({ className }: PointsClickerProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isTouched, setIsTouched] = useState(false)
  const [touches, setTouches] = useState<TouchList>()
  const haptic = useHapticFeedback(true)

  useEffect(() => {
    let ts: number | undefined
    const onTouchStart = (e: any) => {
      ts = e.touches[0].clientY
    }
    const onTouchMove = (e: any) => {
      if (ref.current) {
        const scroll = ref.current.scrollTop
        const te = e.changedTouches[0].clientY
        if (scroll <= 0 && ts! < te) {
          e.preventDefault()
        }
      } else {
        e.preventDefault()
      }
    }
    ref.current?.addEventListener('touchstart', onTouchStart, {
      passive: false,
    })
    ref.current?.addEventListener('touchmove', onTouchMove, {
      passive: false,
    })

    return () => {
      ref.current?.removeEventListener('touchstart', onTouchStart)
      ref.current?.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  const onMouseDown = (event: TouchEvent<HTMLDivElement>) => {
    setIsTouched(true)
    setTouches(event.touches)
  }

  const onMouseUp = () => {
    setIsTouched(false)

    for (let i = 0; i < (touches?.length || 0); i++) {
      const touch = touches?.item(i)

      if (ref.current && touch) {
        const word = document.createElement('div')
        word.classList.add('floating-word')
        word.textContent = 'Soon'

        word.style.left = touch.clientX - 110 + 'px'
        word.style.top = touch.clientY - 130 + 'px'

        ref.current.appendChild(word)

        setTimeout(() => {
          ref.current?.removeChild(word)
        }, 3000)
      }
    }

    haptic?.impactOccurred('medium')

    setTouches(undefined)
  }

  return (
    <div
      ref={ref}
      className={cx('relative max-h-[242px] max-w-[242px]', className)}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
    >
      <div
        className={cx(
          'absolute z-0 h-[175px] w-[175px] bg-[#5E81EA] blur-[102px]',
          'bottom-0 left-0 right-0 top-0 m-auto'
        )}
        style={{ transform: 'translate3d(0, 0, 0)' }}
      ></div>
      <Image
        src={WaiterImage}
        alt=''
        className={cx(
          'h-fullw-full relative z-10',
          isTouched && 'scale-95 transform'
        )}
      />
    </div>
  )
}

export default PointsClicker
