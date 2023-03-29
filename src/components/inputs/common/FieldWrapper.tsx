import { cx, interactionRingStyles } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import { useId } from 'react'

const inputStyles = cva('', {
  variants: {
    variant: {
      fill: 'bg-background-light',
      outlined: 'border border-background-lighter bg-transparent',
    },
    pill: {
      true: 'rounded-3xl',
      false: 'rounded-2xl',
    },
    size: {
      sm: 'pl-4 py-2 pr-8',
      md: 'py-3 pl-5 pr-12',
    },
  },
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
    'hover:brightness-110',
    'focus:brightness-110',
    'disabled:cursor-not-allowed disabled:brightness-75',
    inputStyles({ pill, variant, size }),
    interactionRingStyles()
  )
  const errorClassNames = cx('ring-2 ring-red-500 ring-offset-2')
  const inputClassNames = cx(commonClassNames, error && errorClassNames)

  const rightElementClassNames = cx(
    'absolute',
    'right-2',
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
        {children(usedId, inputClassNames)}
        {rightElement && rightElement(rightElementClassNames)}
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
    pill: _pill,
    inputParentClassName: _inputParentClassName,
    variant: _variant,
    ...otherProps
  } = props

  return otherProps
}
