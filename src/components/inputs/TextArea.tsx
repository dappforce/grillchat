import { cx, scrollBarStyles } from '@/utils/class-names'
import { isTouchDevice } from '@/utils/device'
import {
  ComponentProps,
  forwardRef,
  KeyboardEventHandler,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
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
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const replicatedRef = useRef<HTMLDivElement | null>(null)
    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textAreaRef.current
    )

    useEffect(() => {
      const textArea = textAreaRef.current
      const replicated = replicatedRef.current

      if (!textArea || !replicated) return
      replicated.textContent = textArea.value + ' '
      textArea.addEventListener('input', (e) => {
        replicated.textContent = (e.target as HTMLTextAreaElement)?.value + ' '
      })
    }, [])

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
                ref={textAreaRef}
                id={id}
                className={textAreaClassName}
              />
              <div ref={replicatedRef} className={textAreaClassName} />
            </div>
          )
        }}
      </FieldWrapper>
    )
  }
)
export default TextArea
