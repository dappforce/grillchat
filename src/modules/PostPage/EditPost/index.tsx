import AutofocusWrapper from '@/components/AutofocusWrapper'
import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostContent } from '@subsocial/api/types/dto'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  image: z.string(),
  title: z.string().nonempty('Name cannot be empty'),
  body: z.string(),
  tags: z.array(z.string()),
})
type FormSchema = z.infer<typeof formSchema>

type EditPostFormProps = {
  postContent: PostContent
  postId: string
}

const InnerEditPostForm = ({ postContent, postId }: EditPostFormProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isProcessingData, setIsProcessingData] = useState(false)
  const defaultValues = {
    image: postContent?.image ?? '',
    body: postContent?.body ?? '',
    title: postContent?.title ?? '',
    tags: postContent?.tags ?? [],
  }

  const isUpdating = !!postContent
  const actionText = isUpdating ? 'Save changes' : 'Create'

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

  const { mutateAsync, isLoading: isMutating } = useUpsertPost()

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (postContent && postId) {
      await mutateAsync({
        postId,
        ...data,
      })
    } else {
      await mutateAsync({
        // TODO: need to get the correct spaceId
        spaceId: '',
        timestamp: Date.now(),
        uuid: crypto.randomUUID(),
        ...data,
      })
    }
  }

  const isLoading = /* isMutating ||  */ isProcessingData

  let loadingText = 'Saving...'
  if (!isUpdating) {
    if (!isProcessingData) {
      loadingText = 'Creating...'
    } else {
      loadingText = 'Finalizing...'
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cx('flex flex-col gap-4')}
    >
      <div className='flex flex-col items-start gap-4'>
        <div className='flex w-full gap-4'>
          <span className='max-w-[25%] basis-[20%]'>Avatar:</span>
          <Controller
            control={control}
            name='image'
            render={({ field, fieldState }) => {
              return (
                <div className='flex flex-col items-start gap-1'>
                  <ImageInput
                    disabled={isLoading}
                    image={field.value}
                    setImageUrl={(value) => setValue('image', value)}
                    containerProps={{ className: 'my-2' }}
                    setIsLoading={setIsImageLoading}
                    error={fieldState.error?.message}
                  />
                  <span className='text-text-muted'>
                    Image should be less than 2 MB
                  </span>
                </div>
              )
            }}
          />
        </div>
        <div className='flex w-full gap-4'>
          <span className='max-w-[25%] basis-[25%]'>Space name:</span>
          <AutofocusWrapper>
            {({ ref }) => (
              <Input
                {...register('name')}
                ref={(e) => {
                  register('name').ref(e)
                  ref.current = e
                }}
                disabled={isLoading}
                placeholder='Space Name'
                error={errors.name?.message}
                variant='fill-bg'
              />
            )}
          </AutofocusWrapper>
        </div>
        <div className='flex w-full gap-4'>
          <span className='max-w-[25%] basis-[25%]'>Description:</span>
          <TextArea
            {...register('about')}
            disabled={isLoading}
            placeholder='Description (optional)'
            error={errors.about?.message}
            rows={6}
            variant='fill-bg'
          />
        </div>
      </div>
      <div className='flex w-full gap-4'>
        <span className='max-w-[25%] basis-[25%]'>Tags:</span>
        <TextArea
          {...register('tags')}
          disabled={isLoading}
          placeholder={`Press 'Enter' or 'Tab' key to add tags`}
          error={errors.tags?.message}
          rows={1}
          variant='fill-bg'
        />
      </div>
      <div className='flex w-full gap-4'>
        <span className='max-w-[25%] basis-[25%]'>Email:</span>
        <AutofocusWrapper>
          {({ ref }) => (
            <Input
              {...register('email')}
              ref={(e) => {
                register('email').ref(e)
                ref.current = e
              }}
              disabled={isLoading}
              type='email'
              placeholder='Email Address'
              error={errors.email?.message}
              variant='fill-bg'
            />
          )}
        </AutofocusWrapper>
      </div>

      <div className='flex w-full gap-4'>
        <span className='max-w-[25%] basis-[20%]'></span>
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
      </div>
    </form>
  )
}

const EditPostForm = (props: EditPostFormProps) => {
  return <InnerEditPostForm {...props} />
}

export const EditPost = (props: EditPostFormProps) => {
  return <EditPostForm {...props} />
}

export const NewPost = EditPostForm
