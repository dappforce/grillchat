import clsx from 'clsx'
import { forwardRef, HTMLProps } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'

export type TextFieldProps = HTMLProps<HTMLInputElement> &
  RequiredFieldWrapperProps

const Input = forwardRef<HTMLInputElement, TextFieldProps>(function Input(
  props: TextFieldProps,
  ref
) {
  return (
    <FieldWrapper {...props}>
      {(id, commonClassNames) => (
        <input
          {...getCleanedInputProps(props)}
          ref={ref}
          id={id}
          className={clsx(commonClassNames, props?.className)}
        />
      )}
    </FieldWrapper>
  )
})
export default Input
