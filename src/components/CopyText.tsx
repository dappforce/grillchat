import { cx } from '@/utils/class-names'
import { Space_Mono } from 'next/font/google'
import { ComponentProps, useState } from 'react'
import { MdOutlineContentCopy } from 'react-icons/md'
import Button from './Button'
import PopOver from './PopOver'

export type CopyTextProps = ComponentProps<'div'> & {
  text: string
  textToCopy?: string
  type?: 'short' | 'long'
  onCopyClick?: () => void
  codeText?: boolean
}

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin'],
})

export default function CopyText({
  text,
  textToCopy,
  type = 'short',
  onCopyClick,
  codeText,
  ...props
}: CopyTextProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy || text)

    onCopyClick?.()
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const fontClassName = codeText && spaceMono.className

  if (type === 'short') {
    return (
      <div {...props} className={cx('flex items-center', props.className)}>
        <span className={cx(fontClassName)}>{text}</span>
        <PopOver
          triggerClassName='ml-2'
          yOffset={12}
          trigger={
            <Button
              variant='transparent'
              className='p-0'
              onClick={copyToClipboard}
            >
              <MdOutlineContentCopy />
            </Button>
          }
          panelSize='sm'
        >
          <p>Copied!</p>
        </PopOver>
      </div>
    )
  } else {
    return (
      <div
        {...props}
        className={cx('flex flex-col items-stretch gap-4', props.className)}
      >
        <span
          className={cx(
            'break-all rounded-2xl border border-border-gray p-4',
            fontClassName
          )}
        >
          {text}
        </span>
        <Button disabled={isCopied} onClick={copyToClipboard} size='lg'>
          {isCopied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    )
  }
}
