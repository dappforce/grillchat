import useWrapInRef from '@/hooks/useWrapInRef'
import { getProfileQuery } from '@/services/api/query'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useEffect } from 'react'
import { useForm, UseFormWatch } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../FormButton'
import Input from '../inputs/Input'
import { useName } from '../Name'

export type SubsocialProfileFormProps = ComponentProps<'form'> & {
  onSuccess?: () => void
  onNameChange?: (name: string) => void
  shouldSetAsProfileSource?: boolean
}

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
})
type FormSchema = z.infer<typeof formSchema>

export default function SubsocialProfileForm({
  onSuccess,
  onNameChange,
  shouldSetAsProfileSource,
  ...props
}: SubsocialProfileFormProps) {
  const myAddress = useMyMainAddress()
  const { data: profile } = getProfileQuery.useQuery(myAddress ?? '', {
    enabled: !!myAddress,
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: { name: profile?.profileSpace?.content?.name ?? '' },
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  const { name } = watch()
  const onNameChangeRef = useWrapInRef(onNameChange)
  useEffect(() => {
    onNameChangeRef.current?.(name)
  }, [onNameChangeRef, name])

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = handleSubmit((data) => {
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              name: data.name,
              profileSource: shouldSetAsProfileSource
                ? 'subsocial-profile'
                : profile?.profileSpace?.content?.profileSource,
            },
          })
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
            <ProfileFormButton
              isLoading={isLoading}
              address={myAddress || ''}
              watch={watch}
            />
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}

function ProfileFormButton({
  address,
  watch,
  isLoading,
}: {
  address: string
  watch: UseFormWatch<FormSchema>
  isLoading: boolean
}) {
  const { name } = watch()
  const currentName = useName(address)

  const isNameNotChanged = currentName.name === name

  return (
    <FormButton
      schema={formSchema}
      disabled={isNameNotChanged}
      watch={watch}
      size='lg'
      isLoading={isLoading}
    >
      {isNameNotChanged ? 'Your current profile' : 'Save changes'}
    </FormButton>
  )
}
