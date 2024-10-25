import useWrapInRef from '@/hooks/useWrapInRef'
import { getProfileQuery } from '@/old/services/api/query'
import { UpsertProfileWrapper } from '@/old/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { encodeProfileSource } from '@/utils/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps, useEffect, useState } from 'react'
import { Controller, UseFormWatch, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../FormButton'
import { useName } from '../Name'
import ImageInput from '../inputs/ImageInput'
import Input from '../inputs/Input'
import TextArea from '../inputs/TextArea'

export type SubsocialProfileFormProps = ComponentProps<'form'> & {
  onSuccess?: () => void
  onProfileChange?: (profile: ProfileContent) => void
}

const formSchema = z.object({
  image: z.string(),
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
  about: z.string().max(160, 'Bio is too long'),
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
      about: profileContent?.about ?? '',
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
        const onSubmit = handleSubmit(async (data) => {
          const { experimental, ...otherProfileContet } =
            profile?.profileSpace?.content || {}

          await mutateAsync({
            spaceId: profile?.profileSpace?.id,
            content: {
              ...otherProfileContet,
              ...experimental,
              name: data.name,
              image: data.image,
              about: data.about,
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
              placeholder='* Profile name'
              {...register('name')}
              variant='fill-bg'
              error={errors.name?.message}
            />
            <TextArea
              rows={3}
              placeholder='Bio (optional)'
              {...register('about')}
              variant='fill-bg'
              error={errors.about?.message}
            />
            <ProfileFormButton
              originalAbout={profileContent?.about}
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
  originalAbout,
}: {
  address: string
  watch: UseFormWatch<FormSchema>
  isLoading: boolean
  originalImage?: string
  originalAbout?: string
}) {
  const { name, image, about } = watch()
  const currentName = useName(address)

  const isNotChanged =
    currentName.name === name &&
    image === originalImage &&
    about === originalAbout

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
