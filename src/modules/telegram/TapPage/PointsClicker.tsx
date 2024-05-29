import WaiterImage from '@/assets/graphics/waiter.png'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { TouchEvent, TouchList, useRef, useState } from 'react'

const PointsClicker = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isTouched, setIsTouched] = useState(false)
  const [touches, setTouches] = useState<TouchList>()

  const onMouseDown = (event: TouchEvent<HTMLDivElement>) => {
    setIsTouched(true)
    setTouches(event.touches)
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
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
        word.style.top = touch.clientY - 75 + 'px'

        ref.current.appendChild(word)

        setTimeout(() => {
          ref.current?.removeChild(word)
        }, 3000)
      }
    }

    setTouches(undefined)
  }

  return (
    <div
      ref={ref}
      className='relative max-h-[242px] max-w-[242px]'
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
