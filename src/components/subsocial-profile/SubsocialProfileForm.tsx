import useWrapInRef from '@/hooks/useWrapInRef'
import { getProfileQuery } from '@/services/api/query'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { encodeProfileSource } from '@/utils/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps, useEffect, useState } from 'react'
import { Controller, useForm, UseFormWatch } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../FormButton'
import ImageInput from '../inputs/ImageInput'
import Input from '../inputs/Input'
import { useName } from '../Name'

export type SubsocialProfileFormProps = ComponentProps<'form'> & {
  onSuccess?: () => void
  onProfileChange?: (profile: ProfileContent) => void
}

const formSchema = z.object({
  image: z.string(),
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
})
export function validateNickname(name: string) {
  return formSchema.safeParse({ name }).success
}
type FormSchema = z.infer<typeof formSchema>

export default function SubsocialProfileForm({
  onSuccess,
  onProfileChange,
  ...props
}: SubsocialProfileFormProps) {
  const sendEvent = useSendEvent()
  const myAddress = useMyMainAddress()
  const { data: profile } = getProfileQuery.useQuery(myAddress ?? '', {
    enabled: !!myAddress,
  })

  const profileContent = profile?.profileSpace?.content
  const [isImageLoading, setIsImageLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      name: profileContent?.name ?? '',
      image: profileContent?.image ?? '',
    },
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  const { name, image } = watch()
  const onProfileChangeRef = useWrapInRef(onProfileChange)
  useEffect(() => {
    onProfileChangeRef.current?.({ name, image })
  }, [onProfileChangeRef, name, image])

  return (
    <UpsertProfileWrapper>
      {({ mutateAsync, isLoading }) => {
        const onSubmit = handleSubmit((data) => {
          mutateAsync({
            content: {
              ...profile?.profileSpace?.content,
              name: data.name,
              image: data.image,
              profileSource: encodeProfileSource({
                source: 'subsocial-profile',
              }),
            },
          })
          sendEvent('account_settings_changed', { profileSource: 'custom' })
          onSuccess?.()
        })

        return (
          <form
            {...props}
            onSubmit={onSubmit}
            className={cx('flex flex-col gap-4', props.className)}
          >
            <div className='self-center'>
              <Controller
                control={control}
                name='image'
                render={({ field, fieldState }) => {
                  return (
                    <ImageInput
                      disabled={isLoading}
                      image={field.value}
                      setImageUrl={(value) => setValue('image', value)}
                      containerProps={{ className: 'my-2' }}
                      setIsLoading={setIsImageLoading}
                      error={fieldState.error?.message}
                    />
                  )
                }}
              />
            </div>
            <Input
              placeholder='Name (3-25 symbols)'
              {...register('name')}
              variant='fill-bg'
              error={errors.name?.message}
            />
            <ProfileFormButton
              originalImage={profileContent?.image}
              isLoading={isLoading || isImageLoading}
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
  originalImage,
}: {
  address: string
  watch: UseFormWatch<FormSchema>
  isLoading: boolean
  originalImage?: string
}) {
  const { name, image } = watch()
  const currentName = useName(address)

  const isNotChanged = currentName.name === name && image === originalImage

  return (
    <FormButton
      schema={formSchema}
      disabled={isNotChanged}
      watch={watch}
      size='lg'
      isLoading={isLoading}
    >
      {isNotChanged ? 'Your current profile' : 'Save changes'}
    </FormButton>
  )
}
