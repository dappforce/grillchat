import { cx, interactionRingStyles } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { useId } from 'react'

const inputStyles = cva('', {
  variants: {
    variant: {
      fill: 'bg-background-light',
      'fill-bg': 'bg-background ring-1 ring-border-gray appearance-none',
      outlined:
        'ring-1 ring-background-lightest appearance-none bg-transparent',
    },
    pill: {
      true: 'rounded-3xl',
      false: 'rounded-xl',
    },
    size: {
      sm: 'px-4 py-2',
      md: 'py-3 px-4',
    },
    containsRightElement: {
      true: '',
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      containsRightElement: true,
      className: 'pr-8',
    },
    {
      size: 'md',
      containsRightElement: true,
      className: 'pr-12',
    },
  ],
  defaultVariants: {
    variant: 'outlined',
    pill: false,
    size: 'md',
  },
})

export type RequiredFieldWrapperProps = VariantProps<typeof inputStyles> & {
  containerClassName?: string
  inputParentClassName?: string
  fullWidth?: boolean

  label?: string
  labelClassName?: string
  helperText?: string
  helperTextClassName?: string
  leftElement?: (classNames: string) => JSX.Element
  rightElement?: (classNames: string) => JSX.Element
  helperTextOnRightOfLabel?: string
  helperTextOnRightOfLabelClassNames?: string

  error?: string | boolean
  required?: boolean

  id?: string
}

export interface FieldWrapperProps extends RequiredFieldWrapperProps {
  children: (id: string, commonClassNames: string) => JSX.Element
}

export default function FieldWrapper({
  containerClassName,
  inputParentClassName,
  label,
  labelClassName,
  helperText,
  helperTextClassName,
  fullWidth = true,
  id,
  error,
  required,
  rightElement,
  leftElement,
  helperTextOnRightOfLabel,
  helperTextOnRightOfLabelClassNames,
  pill,
  variant,
  size,
  children,
}: FieldWrapperProps) {
  const generatedId = useId()
  const usedId = id || generatedId

  const commonClassNames = cx(
    'transition duration-150',
    'dark:hover:brightness-110 hover:brightness-105',
    'dark:focus-visible:brightness-110 focus-visible:brightness-105',
    'disabled:cursor-not-allowed disabled:brightness-90 dark:disabled:brightness-75',
    inputStyles({ pill, variant, size, containsRightElement: !!rightElement }),
    interactionRingStyles()
  )
  const errorClassNames = cx('ring-1 ring-red-500 border-transparent')
  const inputClassNames = cx(commonClassNames, error && errorClassNames)

  const rightElementClassNames = cx(
    'absolute right-2',
    'top-1/2 -translate-y-1/2'
  )
  const leftElementClassNames = cx(
    'absolute left-2',
    'top-1/2 -translate-y-1/2'
  )

  const hasErrorMessage = error && typeof error === 'string'

  return (
    <div
      className={cx(
        'flex flex-col',
        fullWidth && 'w-full',
        'space-y-2',
        containerClassName
      )}
    >
      {label && (
        <div
          className={cx(
            'mb-0.5 flex items-end justify-between',
            labelClassName
          )}
        >
          <label htmlFor={usedId}>
            {label}
            {required && <span className='text-red-500'> *</span>}
          </label>
          <p
            className={cx(
              'text-text-secondary',
              helperTextOnRightOfLabelClassNames
            )}
          >
            {helperTextOnRightOfLabel}
          </p>
        </div>
      )}
      <div
        className={cx('relative flex w-full flex-col', inputParentClassName)}
      >
        {leftElement?.(leftElementClassNames)}
        {children(usedId, inputClassNames)}
        {rightElement?.(rightElementClassNames)}
      </div>
      {(helperText || hasErrorMessage) && (
        <p
          className={cx(
            'text-sm text-text-secondary',
            hasErrorMessage && '!text-red-500',
            helperTextClassName
          )}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  )
}

export function getCleanedInputProps<T extends RequiredFieldWrapperProps>(
  props: T
) {
  const {
    containerClassName: _containerProps,
    label: _label,
    labelClassName: _labelProps,
    error: _error,
    fullWidth: _fullWidth,
    helperText: _helperText,
    helperTextClassName: _helperTextProps,
    id: _id,
    helperTextOnRightOfLabel: _helperTextOnRightOfLabel,
    helperTextOnRightOfLabelClassNames: _helperTextOnRightOfLabelClassNames,
    rightElement: _rightElement,
    leftElement: _leftElement,
    pill: _pill,
    inputParentClassName: _inputParentClassName,
    variant: _variant,
    size: _size,
    ...otherProps
  } = props

  return otherProps
}
