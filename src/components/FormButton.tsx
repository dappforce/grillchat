import { UseFormWatch } from 'react-hook-form'
import { z } from 'zod'
import Button, { ButtonProps } from './Button'

export type FormButtonProps<Schema extends z.ZodTypeAny> = ButtonProps & {
  schema: Schema
  watch: UseFormWatch<z.infer<Schema>>
}

export default function FormButton<Schema extends Zod.ZodTypeAny>({
  schema,
  watch,
  ...props
}: FormButtonProps<Schema>) {
  const data = watch()
  const isValid = schema.safeParse(data).success
  console.log(data, isValid)

  return (
    <Button type='submit' {...props} disabled={!isValid || props.disabled} />
  )
}
