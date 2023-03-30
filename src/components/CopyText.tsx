import { cx, interactionRingStyles } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { Space_Mono } from 'next/font/google'
import { ComponentProps, useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { MdOutlineContentCopy } from 'react-icons/md'
import Button from './Button'
import PopOver from './PopOver'

type CommonCopyTextProps = ComponentProps<'div'> & {
  text: string
  textToCopy?: string
  onCopyClick?: () => void
  isCodeText?: boolean
  withHideButton?: boolean
}

const spaceMono = Space_Mono({
  weight: '400',
  subsets: ['latin'],
})

const copyTextStyles = cva('', {
  variants: {
    size: {
      md: 'px-4 py-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type CopyTextProps = CommonCopyTextProps &
  VariantProps<typeof copyTextStyles>
export function CopyText({
  text,
  textToCopy,
  onCopyClick,
  isCodeText: codeText,
  withHideButton,
  size,
  ...props
}: CopyTextProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy || text)

    onCopyClick?.()
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const fontClassName = codeText && spaceMono.className

  return (
    <div
      {...props}
      className={cx('flex flex-col items-stretch gap-4', props.className)}
    >
      <div
        className={cx(
          'flex items-stretch rounded-2xl border border-border-gray',
          fontClassName
        )}
      >
        <span
          className={cx(
            'cursor-pointer select-all break-all py-2 px-4',
            copyTextStyles({ size }),
            isHidden && 'blur-sm'
          )}
        >
          {text}
        </span>
        {withHideButton && (
          <Button
            size='noPadding'
            variant='transparent'
            className={cx(
              'block rounded-r-2xl rounded-l-none px-4 text-2xl',
              interactionRingStyles({ variant: 'no-offset' })
            )}
            interactive='brightness-only'
            onClick={() => setIsHidden((prev) => !prev)}
          >
            {isHidden ? <HiOutlineEyeOff /> : <HiOutlineEye />}
          </Button>
        )}
      </div>
      <Button disabled={isCopied} onClick={copyToClipboard} size='lg'>
        {isCopied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  )
}

export type CopyTextInlineProps = CommonCopyTextProps & {
  tooltip?: string
}
export function CopyTextInline({
  text,
  textToCopy,
  onCopyClick,
  isCodeText: codeText,
  withHideButton,
  tooltip,
  ...props
}: CopyTextInlineProps) {
  const [click, setClick] = useState(false)
  const [hover, setHover] = useState(false)
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy || text)
    onCopyClick?.()
  }

  const fontClassName = codeText && spaceMono.className
  return (
    <div {...props} className={cx('flex items-center', props.className)}>
      <span className={cx(fontClassName)}>{text}</span>
      <PopOver
        triggerClassName='ml-2'
        manualTrigger={{ isOpen: click, setIsOpen: setClick }}
        yOffset={12}
        trigger={
          <PopOver
            panelSize='sm'
            yOffset={12}
            triggerOnHover
            manualTrigger={{
              isOpen: click ? false : hover,
              setIsOpen: setHover,
            }}
            trigger={
              <Button
                variant='transparent'
                className='p-1 text-text-primary'
                onClick={copyToClipboard}
              >
                <MdOutlineContentCopy />
              </Button>
            }
          >
            <p>Copy my public address</p>
          </PopOver>
        }
        panelSize='sm'
      >
        <p>Copied!</p>
      </PopOver>
    </div>
  )
}
