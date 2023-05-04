import { cx, interactionRingStyles } from '@/utils/class-names'
import { copyToClipboard } from '@/utils/text'
import { cva, VariantProps } from 'class-variance-authority'
import { Space_Mono } from 'next/font/google'
import { ComponentProps, useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import { MdOutlineContentCopy } from 'react-icons/md'
import Button from './Button'
import PopOver from './floating/PopOver'

type CommonCopyTextProps = ComponentProps<'div'> & {
  text: string | JSX.Element
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

function getTextToCopy({
  text,
  textToCopy,
}: Pick<CommonCopyTextProps, 'text' | 'textToCopy'>) {
  return textToCopy || (typeof text === 'string' ? text : '')
}

export type CopyTextProps = CommonCopyTextProps &
  VariantProps<typeof copyTextStyles>
export function CopyText({
  text,
  textToCopy,
  onCopyClick,
  isCodeText,
  withHideButton,
  size,
  ...props
}: CopyTextProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const handleClick = () => {
    copyToClipboard(getTextToCopy({ text, textToCopy }))

    onCopyClick?.()
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const fontClassName = isCodeText && spaceMono.className

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
        <div
          className={cx(
            'cursor-pointer select-all break-all py-2 px-4',
            copyTextStyles({ size }),
            isHidden && 'blur-sm'
          )}
        >
          {text}
        </div>
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
            {isHidden ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
          </Button>
        )}
      </div>
      <Button disabled={isCopied} onClick={handleClick} size='lg'>
        {isCopied ? 'Copied' : 'Copy'}
      </Button>
    </div>
  )
}

export type CopyTextInlineProps = CommonCopyTextProps & {
  tooltip?: string
  textClassName?: string
}
export function CopyTextInline({
  text,
  textToCopy,
  onCopyClick,
  isCodeText: codeText,
  withHideButton,
  tooltip,
  textClassName,
  ...props
}: CopyTextInlineProps) {
  const [openTooltipClickTrigger, setOpenTooltipClickTrigger] = useState(false)
  const [openTooltipHoverTrigger, setOpenTooltipHoverTrigger] = useState(false)
  const handleClick = () => {
    copyToClipboard(getTextToCopy({ text, textToCopy }))
    onCopyClick?.()
  }

  const fontClassName = codeText && spaceMono.className
  let copyButton = (
    <Button
      variant='transparent'
      className='p-1 text-text-primary'
      onClick={handleClick}
    >
      <MdOutlineContentCopy />
    </Button>
  )

  if (tooltip) {
    copyButton = (
      <PopOver
        panelSize='sm'
        yOffset={12}
        triggerOnHover
        manualTrigger={{
          isOpen: openTooltipClickTrigger ? false : openTooltipHoverTrigger,
          setIsOpen: setOpenTooltipHoverTrigger,
        }}
        trigger={copyButton}
      >
        <p>{tooltip}</p>
      </PopOver>
    )
  }

  return (
    <div {...props} className={cx('flex items-center', props.className)}>
      <div className={cx(fontClassName, textClassName)}>{text}</div>
      <PopOver
        triggerClassName='ml-2'
        manualTrigger={{
          isOpen: openTooltipClickTrigger,
          setIsOpen: setOpenTooltipClickTrigger,
        }}
        yOffset={12}
        trigger={copyButton}
        panelSize='sm'
      >
        <p>Copied!</p>
      </PopOver>
    </div>
  )
}
