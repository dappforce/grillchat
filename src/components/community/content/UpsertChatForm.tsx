import AutofocusWrapper from '@/components/AutofocusWrapper'
import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import { getDeterministicId } from '@/services/datahub/posts/mutation'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { useSubscriptionState } from '@/stores/subscription'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostData } from '@subsocial/api/types'
import { ComponentProps, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

type InsertAdditionalProps = {
  hubId?: string
}
type UpdateAdditionalProps = {
  chat: PostData
}
export type UpsertChatFormProps = ComponentProps<'form'> &
  (InsertAdditionalProps | UpdateAdditionalProps) & {
    onSuccess?: () => void
    onTxSuccess?: () => void
    customModalStates?: {
      onLoading: () => void
    }
  }

const formSchema = z.object({
  image: z.string(),
  title: z.string().nonempty('Name cannot be empty'),
  body: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export default function UpsertChatForm(props: UpsertChatFormProps) {
  const { openModal, setNewChatId } = useCreateChatModal()
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isProcessingData, setIsProcessingData] = useState(false)
  const sendEvent = useSendEvent()

  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )

  const {
    chat,
    hubId,
    onSuccess,
    onTxSuccess,
    customModalStates,
    ...otherProps
  } = props as UpsertChatFormProps &
    Partial<InsertAdditionalProps & UpdateAdditionalProps>

  const myAddress = useMyMainAddress()

  const defaultValues = {
    image: chat?.content?.image ?? '',
    body: chat?.content?.body ?? '',
    title: chat?.content?.title ?? '',
  }
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormSchema>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const isUpdating = !!chat
  const actionText = isUpdating ? 'Save changes' : 'Create'

  const { mutateAsync, isLoading: isMutating } = useUpsertPost({
    onSuccess: async (_, data) => {
      if (isUpdating || !myAddress || !('spaceId' in data)) return

      setSubscriptionState('post', 'always-sub')
      setIsProcessingData(true)
      const chatId = await getDeterministicId({
        account: myAddress,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      sendEvent('community_chat_created', { hubId }, { ownedChat: true })

      setNewChatId(chatId)
    },
  })
  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (!isUpdating) {
      sendEvent('start_community_chat_creation')
    }

    if (chat?.id) {
      await mutateAsync({
        postId: chat.id,
        ...data,
      })
    } else {
      console.log('hubId', hubId)
      await mutateAsync({
        spaceId: hubId ?? '',
        timestamp: Date.now(),
        uuid: crypto.randomUUID(),
        ...data,
      })
    }
    onSuccess?.()
  }

  const isLoading = isMutating || isProcessingData

  let loadingText = 'Saving...'
  if (!isUpdating) {
    if (!isProcessingData) {
      loadingText = 'Creating...'
    } else {
      loadingText = 'Finalizing group chat...'
    }
  }

  return (
    <form
      {...otherProps}
      onSubmit={handleSubmit(onSubmit)}
      className={cx('flex flex-col gap-4', otherProps.className)}
    >
      <div className='flex flex-col items-center gap-4'>
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
        <AutofocusWrapper>
          {({ ref }) => (
            <Input
              {...register('title')}
              ref={(e) => {
                register('title').ref(e)
                ref.current = e
              }}
              disabled={isLoading}
              placeholder='Chat Name'
              error={errors.title?.message}
              variant='fill-bg'
            />
          )}
        </AutofocusWrapper>
        <TextArea
          {...register('body')}
          disabled={isLoading}
          placeholder='Description (optional)'
          error={errors.body?.message}
          rows={1}
          variant='fill-bg'
        />
      </div>

      <FormButton
        schema={formSchema}
        watch={watch}
        isLoading={isLoading}
        disabled={isImageLoading}
        loadingText={loadingText}
        size='lg'
      >
        {actionText}
      </FormButton>
    </form>
  )
}
