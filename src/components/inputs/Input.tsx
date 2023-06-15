import { cx } from '@/utils/class-names'
import { ComponentProps, forwardRef } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'

export type InputProps = Omit<ComponentProps<'input'>, 'size'> &
  RequiredFieldWrapperProps

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  props: InputProps,
  ref
) {
  return (
    <FieldWrapper {...props}>
      {(id, commonClassNames, labelElement) => (
        <>
          <input
            {...getCleanedInputProps(props)}
            ref={ref}
            id={id}
            className={cx(commonClassNames, props?.className)}
          />
          {labelElement}
        </>
      )}
    </FieldWrapper>
  )
})
export default Input
