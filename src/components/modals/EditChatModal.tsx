import { zodResolver } from '@hookform/resolvers/zod'
import { PostData } from '@subsocial/api/types'
import { ReactNode, useEffect } from 'react'
import { Controller, useForm, UseFormWatch } from 'react-hook-form'
import { z } from 'zod'
import Button from '../Button'
import ImageInput from '../inputs/ImageInput'
import Input from '../inputs/Input'
import TextArea from '../inputs/TextArea'
import Modal, { ModalFunctionalityProps, ModalProps } from './Modal'

export type UpsertChatModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick'> & {
    chat: PostData
  }

const formSchema = z.object({
  image: z.string().nonempty('Please upload an image.'),
  title: z.string().nonempty('Please enter a title.'),
  body: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export default function UpsertChatModal({
  chat,
  ...props
}: UpsertChatModalProps) {
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
      image: chat.content?.image,
      body: chat.content?.body,
      title: chat.content?.title,
    },
  })

  useEffect(() => {
    if (props.isOpen) reset()
  }, [props.isOpen, reset])

  const onSubmit = () => {}

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
    <Modal {...props} title={usedTexts.title} withCloseButton>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <div className='flex flex-col items-center gap-4'>
          <Controller
            {...register('image')}
            control={control}
            render={({ field, fieldState }) => {
              return (
                <ImageInput
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
            error={errors.title?.message}
            variant='fill-bg'
          />
          <TextArea
            {...register('body')}
            error={errors.body?.message}
            variant='fill-bg'
          />
        </div>

        <SubmitButton watch={watch}>{usedTexts.button}</SubmitButton>
      </form>
    </Modal>
  )
}

function SubmitButton({
  children,
  watch,
}: {
  watch: UseFormWatch<FormSchema>
  children: ReactNode
}) {
  const { image, title, body } = watch()
  const anyError =
    formSchema.safeParse({ image, title, body }).success === false

  return (
    <Button size='lg' type='submit' disabled={anyError}>
      {children}
    </Button>
  )
}
