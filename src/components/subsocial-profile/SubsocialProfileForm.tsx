import useWrapInRef from '@/hooks/useWrapInRef'
import { useUpsertProfile } from '@/services/datahub/profiles/mutation'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { augmentDatahubParams } from '@/services/datahub/utils'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps, useEffect, useState } from 'react'
import { Controller, UseFormWatch, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import FormButton from '../FormButton'
import { useName } from '../Name'
import Toast from '../Toast'
import ImageInput from '../inputs/ImageInput'
import Input from '../inputs/Input'
import TextArea from '../inputs/TextArea'

export type UpsertProfileFormProps = ComponentProps<'form'> & {
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

export default function UpsertProfileForm({
  onSuccess,
  onProfileChange,
  ...props
}: UpsertProfileFormProps) {
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

  const { mutateAsync, isLoading: isUpserting } = useUpsertProfile()
  const isLoading = isUpserting

  const onSubmit = handleSubmit(async (data) => {
    if (!profile) {
      toast.custom((t) => (
        <Toast
          t={t}
          title='Failed to update profile'
          description='Please close and reopen the app if the problem persist'
        />
      ))
      return
    }
    const augmented = await augmentDatahubParams({
      spaceId: profile?.profileSpace?.id,
      content: {
        ...profile?.profileSpace?.content,
        name: data.name,
        image: data.image,
        about: data.about,
      },
    })
    await mutateAsync(augmented)
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
