import { getProfileQuery } from '@/services/api/query'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../FormButton'
import Input from '../inputs/Input'

export type SubsocialProfileFormProps = ComponentProps<'form'> & {
  onSuccess?: () => void
}

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
})
type FormSchema = z.infer<typeof formSchema>

export default function SubsocialProfileForm({
  onSuccess,
  ...props
}: SubsocialProfileFormProps) {
  const myAddress = useMyAccount((state) => state.address)
  const { data } = getProfileQuery.useQuery(myAddress ?? '', {
    enabled: !!myAddress,
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: { name: data?.profileSpace?.name ?? '' },
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  })

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync }) => {
        const onSubmit = handleSubmit((data) => {
          mutateAsync({ content: { name: data.name } })
          onSuccess?.()
        })

        return (
          <form
            {...props}
            onSubmit={onSubmit}
            className={cx('flex flex-col gap-4', props.className)}
          >
            <Input
              placeholder='Name (3-25 symbols)'
              {...register('name')}
              variant='fill-bg'
              error={errors.name?.message}
            />
            <FormButton schema={formSchema} watch={watch} size='lg'>
              Save
            </FormButton>
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}
