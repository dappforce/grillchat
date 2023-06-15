import { cx, interactionRingStyles } from '@/utils/class-names'
import { cva, VariantProps } from 'class-variance-authority'
import React, { useId } from 'react'

const inputStyles = cva('', {
  variants: {
    variant: {
      fill: 'bg-background-light',
      outlined: 'border border-background-lightest bg-transparent',
    },
    pill: {
      true: 'rounded-3xl',
      false: 'rounded-2xl',
    },
    size: {
      sm: 'px-4 py-2',
      md: 'py-3 px-5',
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

const labelStyles = cva(
  'absolute z-10 origin-[0] scale-75 transform bg-background px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500',
  {
    variants: {
      size: {
        sm: 'left-3 top-2.5 -translate-y-5.5 peer-focus:-translate-y-5.5',
        md: 'left-4 top-4 -translate-y-7 peer-focus:-translate-y-7',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

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
  children: (
    id: string,
    commonClassNames: string,
    labelElement: React.ReactNode
  ) => JSX.Element
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
    'hover:brightness-110',
    'focus:brightness-110',
    'disabled:cursor-not-allowed disabled:brightness-75',
    'peer',
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

  const labelElement = label && (
    <div
      className={cx(
        'flex items-end justify-between',
        labelStyles({ size }),
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
  )

  return (
    <div
      className={cx(
        'flex flex-col',
        fullWidth && 'w-full',
        'space-y-2',
        containerClassName
      )}
    >
      <div
        className={cx('relative flex w-full flex-col', inputParentClassName)}
      >
        {leftElement?.(leftElementClassNames)}
        {children(usedId, inputClassNames, labelElement)}
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

  return {
    ...otherProps,
    placeholder: ' ',
  }
}
