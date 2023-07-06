import { UpsertChatWrapper } from '@/services/subsocial/posts/mutation'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostData } from '@subsocial/api/types'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../../FormButton'
import ImageInput from '../../inputs/ImageInput'
import Input from '../../inputs/Input'
import TextArea from '../../inputs/TextArea'
import Modal, { ModalFunctionalityProps, ModalProps } from '../Modal'

type InsertAdditionalProps = {
  hubId: string
}
type UpdateAdditionalProps = {
  chat: PostData
}
export type UpsertChatModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick'> &
  (InsertAdditionalProps | UpdateAdditionalProps) & {
    onSuccess?: () => void
  }

const formSchema = z.object({
  image: z.string().nonempty('Please upload an image.'),
  title: z.string().nonempty('Please enter a title.'),
  body: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export default function UpsertChatModal(props: UpsertChatModalProps) {
  const { chat, hubId, onSuccess, ...otherProps } =
    props as UpsertChatModalProps &
      Partial<InsertAdditionalProps & UpdateAdditionalProps>

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormSchema>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: chat?.content?.image,
      body: chat?.content?.body,
      title: chat?.content?.title,
    },
  })

  useEffect(() => {
    if (props.isOpen) reset()
  }, [props.isOpen, reset])

  const texts = {
    update: {
      title: '✏️ Edit chat',
      button: 'Save changes',
    },
    insert: {
      title: '💬 New Chat',
      button: 'Create',
    },
  }
  const usedTexts = chat ? texts.update : texts.insert

  return (
    <Modal {...otherProps} title={usedTexts.title} withCloseButton>
      <UpsertChatWrapper>
        {({ isLoading, mutateAsync }) => {
          const onSubmit: SubmitHandler<FormSchema> = async (data) => {
            await mutateAsync({ spaceId: hubId, postId: chat?.id, ...data })
            onSuccess?.()
            props.closeModal()
          }

          return (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-4'
            >
              <div className='flex flex-col items-center gap-4'>
                <Controller
                  {...register('image')}
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <ImageInput
                        disabled={isLoading}
                        image={field.value}
                        setImageUrl={(value) => setValue('image', value)}
                        containerProps={{ className: 'my-2' }}
                        error={fieldState.error?.message}
                      />
                    )
                  }}
                />
                <Input
                  {...register('title')}
                  disabled={isLoading}
                  placeholder='Chat Name'
                  error={errors.title?.message}
                  variant='fill-bg'
                />
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
                size='lg'
              >
                {usedTexts.button}
              </FormButton>
            </form>
          )
        }}
      </UpsertChatWrapper>
    </Modal>
  )
}
