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
  text: string | JSX.Element | null
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
  textContainerClassName?: string
  withButton?: boolean
}
export function CopyTextInline({
  text,
  textToCopy,
  onCopyClick,
  isCodeText: codeText,
  withHideButton,
  tooltip,
  textClassName,
  textContainerClassName,
  withButton = true,
  ...props
}: CopyTextInlineProps) {
  const [openTooltipClickTrigger, setOpenTooltipClickTrigger] = useState(false)
  const [openTooltipHoverTrigger, setOpenTooltipHoverTrigger] = useState(false)
  const [openTooltipClickTriggerButton, setOpenTooltipClickTriggerButton] =
    useState(false)
  const [openTooltipHoverTriggerButton, setOpenTooltipHoverTriggerButton] =
    useState(false)
  const handleClick = () => {
    copyToClipboard(getTextToCopy({ text, textToCopy }))
    onCopyClick?.()
  }

  const fontClassName = codeText && spaceMono.className
  let trigger = (
    <div
      className={cx(
        'w-full flex-1 cursor-pointer',
        fontClassName,
        textClassName
      )}
    >
      {text}
    </div>
  )
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
    trigger = (
      <PopOver
        panelSize='sm'
        yOffset={12}
        triggerOnHover
        manualTrigger={{
          isOpen: openTooltipClickTrigger ? false : openTooltipHoverTrigger,
          setIsOpen: setOpenTooltipHoverTrigger,
        }}
        trigger={trigger}
      >
        <p>{tooltip}</p>
      </PopOver>
    )
    copyButton = (
      <PopOver
        panelSize='sm'
        yOffset={12}
        triggerOnHover
        manualTrigger={{
          isOpen: openTooltipClickTriggerButton
            ? false
            : openTooltipHoverTriggerButton,
          setIsOpen: setOpenTooltipHoverTriggerButton,
        }}
        trigger={copyButton}
      >
        <p>{tooltip}</p>
      </PopOver>
    )
  }

  return (
    <div {...props} className={cx('flex items-center gap-2', props.className)}>
      <div>
        {text && (
          <PopOver
            triggerClassName={cx(textContainerClassName)}
            manualTrigger={{
              isOpen: openTooltipClickTrigger,
              setIsOpen: setOpenTooltipClickTrigger,
            }}
            yOffset={12}
            trigger={trigger}
            panelSize='sm'
          >
            <p>Copied!</p>
          </PopOver>
        )}
      </div>
      <div>
        {withButton && (
          <PopOver
            triggerClassName={cx(textContainerClassName)}
            manualTrigger={{
              isOpen: openTooltipClickTriggerButton,
              setIsOpen: setOpenTooltipClickTriggerButton,
            }}
            yOffset={12}
            trigger={copyButton}
            panelSize='sm'
          >
            <p>Copied!</p>
          </PopOver>
        )}
      </div>
    </div>
  )
}
