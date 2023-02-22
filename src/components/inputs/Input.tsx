import clsx from 'clsx'
import { HTMLProps } from 'react'
import FieldWrapper, {
  getCleanedInputProps,
  RequiredFieldWrapperProps,
} from './common/FieldWrapper'

export type TextFieldProps = HTMLProps<HTMLInputElement> &
  RequiredFieldWrapperProps

export default function Input(props: TextFieldProps) {
  return (
    <FieldWrapper {...props}>
      {(id, commonClassNames) => (
        <input
          {...getCleanedInputProps(props)}
          id={id}
          className={clsx(commonClassNames, props?.className)}
        />
      )}
    </FieldWrapper>
  )
}
