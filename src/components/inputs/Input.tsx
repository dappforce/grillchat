import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'

export type InputProps = ComponentProps<'input'> & RequiredFieldWrapperProps

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props: InputProps,
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
