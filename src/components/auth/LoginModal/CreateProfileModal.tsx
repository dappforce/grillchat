import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import Modal, {
  ModalFunctionalityProps,
  ModalProps,
} from '@/components/modals/Modal'
import { getProfileQuery } from '@/services/api/query'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { encodeProfileSource } from '@/utils/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { finishLogin, getRedirectCallback } from './utils'

export default function CreateProfileModal({
  ...props
}: ModalFunctionalityProps &
  Pick<ModalProps, 'withoutOverlay' | 'withoutShadow'>) {
  const sendEvent = useSendEvent()
  const hasRedirectCallback = !!getRedirectCallback()
  const myAddress = useMyMainAddress()
  const { data: profile } = getProfileQuery.useQuery(myAddress ?? '')
  const hasSubmitted = useRef(false)

  useEffect(() => {
    if (props.isOpen && profile?.profileSpace?.id && !hasSubmitted.current) {
      finishLogin(props.closeModal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, props.isOpen])

  useEffect(() => {
    sendEvent('login_profile_form_opened')
  }, [sendEvent])

  return (
    <Modal
      {...props}
      closeModal={() => undefined}
      title='💬 Create your profile'
      withCloseButton={false}
    >
      <CreateProfileForm
        loadingUntilTxSuccess={hasRedirectCallback}
        onSubmit={() => (hasSubmitted.current = true)}
        onTxSuccess={
          hasRedirectCallback
            ? () => {
                sendEvent('login_profile_created')
                finishLogin(props.closeModal)
              }
            : undefined
        }
        onSuccessSent={
          hasRedirectCallback
            ? undefined
            : () => {
                sendEvent('login_profile_created')
                props.closeModal()
              }
        }
      />
    </Modal>
  )
}

const formSchema = z.object({
  image: z.string(),
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
  about: z.string().max(160, 'Bio is too long'),
})
type FormSchema = z.infer<typeof formSchema>

function CreateProfileForm({
  onSubmit,
  onSuccessSent,
  onTxSuccess,
  loadingUntilTxSuccess,
}: {
  onSubmit?: () => void
  onSuccessSent?: () => void
  onTxSuccess?: () => void
  loadingUntilTxSuccess?: boolean
}) {
  const sendEvent = useSendEvent()

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
      name: '',
      image: '',
      about: '',
    },
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  return (
    <UpsertProfileWrapper
      loadingUntilTxSuccess={loadingUntilTxSuccess}
      config={{
        txCallbacks: {
          onSuccess: () => {
            onTxSuccess?.()
          },
        },
      }}
    >
      {({ mutateAsync, isLoading }) => {
        const handleCreateProfileSubmit = handleSubmit(async (data) => {
          sendEvent('account_settings_changed', { profileSource: 'custom' })
          onSubmit?.()
          await mutateAsync({
            content: {
              name: data.name,
              image: data.image,
              about: data.about,

              profileSource: encodeProfileSource({
                source: 'subsocial-profile',
              }),
            },
          })
          onSuccessSent?.()
        })

        return (
          <form
            onSubmit={handleCreateProfileSubmit}
            className={cx('flex flex-col gap-4')}
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
            <FormButton
              schema={formSchema}
              watch={watch}
              size='lg'
              isLoading={isLoading || isImageLoading}
            >
              Create
            </FormButton>
          </form>
        )
      }}
    </UpsertProfileWrapper>
  )
}
