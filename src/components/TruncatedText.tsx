import { cx } from '@/utils/class-names'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { linkTextStyles } from './LinkText'

export type TruncatedTextProps = ComponentProps<'div'> & {
  text: string
}

export default function TruncatedText({ text, ...props }: TruncatedTextProps) {
  const [isClamping, setIsClamping] = useState(true)

  const clampContainerRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const scrollHeight = clampContainerRef.current?.scrollHeight ?? 0
    const height = clampContainerRef.current?.clientHeight ?? 0
    setIsClamping(scrollHeight > height)
  }, [])

  return (
    <div {...props} className='flex flex-col'>
      <span
        ref={clampContainerRef}
        className={cx(isClamping && 'line-clamp-3')}
      >
        {text}
      </span>
      {isClamping && (
        <span
          onClick={() => setIsClamping(false)}
          className={cx(
            linkTextStyles({ variant: 'secondary' }),
            'mt-0.5 text-sm'
          )}
        >
          Show more
        </span>
      )}
    </div>
  )
}
