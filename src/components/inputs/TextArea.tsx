import { cx, scrollBarStyles } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { submitClosestForm } from '@/utils/form'
import clsx from 'clsx'
import { ComponentProps, forwardRef, KeyboardEventHandler } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'
import styles from './TextArea.module.css'

export type TextAreaProps = ComponentProps<'textarea'> &
  RequiredFieldWrapperProps

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(props: TextAreaProps, ref) {
    const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if (!isTouchDevice() && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submitClosestForm(e.target as HTMLElement)
      }
      props.onKeyDown?.(e)
    }

    return (
      <FieldWrapper {...props}>
        {(id, commonClassNames) => (
          <div
            className={cx(
              styles.textAreaWrapper,
              'after:py-3 after:pl-5 after:pr-12'
            )}
            data-replicated-value={props.value}
          >
            <textarea
              {...getCleanedInputProps(props)}
              onKeyDown={onKeyDown}
              ref={ref}
              id={id}
              className={clsx(
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
