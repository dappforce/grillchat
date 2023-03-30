import { cx, scrollBarStyles } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { cva } from 'class-variance-authority'
import { ComponentProps, forwardRef, KeyboardEventHandler } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'
import styles from './TextArea.module.css'

const textAreaAfterStyles = cva('', {
  variants: {
    size: {
      sm: 'after:pl-4 after:py-2 after:pr-8',
      md: 'after:py-3 after:pl-5 after:pr-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type TextAreaProps = ComponentProps<'textarea'> &
  RequiredFieldWrapperProps & {
    onEnterToSubmitForm?: () => void
  }

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ onEnterToSubmitForm, ...props }: TextAreaProps, ref) {
    const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if (!isTouchDevice() && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onEnterToSubmitForm?.()
      }
      props.onKeyDown?.(e)
    }

    return (
      <FieldWrapper {...props}>
        {(id, commonClassNames) => (
          <div
            className={cx(
              styles.textAreaWrapper,
              textAreaAfterStyles({ size: props.size })
            )}
            data-replicated-value={props.value}
          >
            <textarea
              {...getCleanedInputProps(props)}
              onKeyDown={onKeyDown}
              ref={ref}
              id={id}
              className={cx(
                commonClassNames,
                props?.className,
                scrollBarStyles({ none: true })
              )}
            />
          </div>
        )}
      </FieldWrapper>
    )
  }
)
export default TextArea
