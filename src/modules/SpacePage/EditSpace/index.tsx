import AutofocusWrapper from '@/components/AutofocusWrapper'
import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { useUpsertSpace } from '@/services/datahub/spaces/mutation'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { SpaceContent } from '@subsocial/api/types/dto'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  image: z.string(),
  name: z.string().nonempty('Name cannot be empty'),
  about: z.string(),
  tags: z.array(z.string()),
  email: z.string().email('Invalid email'),
})
type FormSchema = z.infer<typeof formSchema>

type EditSpaceProps = {
  spaceContent?: SpaceContent
  spaceId?: string
}

const InnerUpsertSpaceForm = ({ spaceContent, spaceId }: EditSpaceProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isProcessingData, setIsProcessingData] = useState(false)
  const defaultValues = {
    image: spaceContent?.image ?? '',
    about: spaceContent?.about ?? '',
    name: spaceContent?.name ?? '',
    tags: spaceContent?.tags ?? [],
    email: spaceContent?.email ?? '',
  }

  const isUpdating = !!spaceContent
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

  const { mutateAsync, isLoading: isMutating } = useUpsertSpace()

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (spaceContent && spaceId) {
      await mutateAsync({
        spaceId,
        content: {
          ...data,
        },
      })
    } else {
      await mutateAsync({
        timestamp: Date.now(),
        uuid: crypto.randomUUID(),
        content: {
          ...data,
        },
      })
    }
  }

  const isLoading = /* isMutating ||  */ isProcessingData

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

const UpsertSpaceForm = (props: EditSpaceProps) => {
  const { search, setSearch, focusController } = useSearch()

  return (
    <DefaultLayout
      withSidebar
      withRightSidebar={false}
      navbarProps={{
        customContent: ({
          logoLink,
          authComponent,
          notificationBell,
          newPostButton,
        }) => {
          return (
            <NavbarWithSearch
              customContent={(searchButton) => (
                <div className='flex w-full items-center justify-between gap-4'>
                  {logoLink}
                  <div className='flex items-center gap-0'>
                    {newPostButton}
                    {searchButton}
                    {notificationBell}
                    <div className='ml-2.5'>{authComponent}</div>
                  </div>
                </div>
              )}
              searchProps={{
                search,
                setSearch,
                ...focusController,
              }}
            />
          )
        },
      }}
    >
      <div className='flex w-full flex-1 flex-col gap-6 p-4 lg:pr-3'>
        <div className='flex items-center justify-between gap-4 border-b border-[#d1d1d1] pb-3'>
          <span className='mb-0 text-2xl font-medium'>Create new space</span>
        </div>
        <InnerUpsertSpaceForm {...props} />
      </div>
    </DefaultLayout>
  )
}

export const EditSpace = (props: EditSpaceProps) => {
  return <UpsertSpaceForm {...props} />
}

export const NewSpace = () => {
  return <UpsertSpaceForm />
}
