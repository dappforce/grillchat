import { cx, scrollBarStyles } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import { ComponentProps, forwardRef, KeyboardEventHandler } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'
import styles from './TextArea.module.css'

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
        {(id, commonClassNames) => {
          const textAreaClassName = cx(
            commonClassNames,
            props?.className,
            scrollBarStyles({ none: true })
          )

          return (
            <div className={cx(styles.textAreaWrapper)}>
              <textarea
                {...getCleanedInputProps(props)}
                onKeyDown={onKeyDown}
                ref={ref}
                id={id}
                className={textAreaClassName}
              />
              <div className={textAreaClassName}>{props.value}</div>
            </div>
          )
        }}
      </FieldWrapper>
    )
  }
)
export default TextArea
