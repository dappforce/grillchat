import DefaultLayout from '@/components/layouts/DefaultLayout'
import NavbarWithSearch from '@/components/navbar/Navbar/custom/NavbarWithSearch'
import useSearch from '@/hooks/useSearch'
import { useUpsertPost } from '@/services/subsocial/posts/mutation'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getDeterministicId } from '@/utils/deterministic-id'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostContent } from '@subsocial/api/types/dto'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import EditorSection from './editor/EditorSection'
import PostParamsSection from './editor/PostParamsSection'

export const formSchema = z.object({
  image: z.string(),
  title: z.string().nonempty('Name cannot be empty'),
  body: z.string(),
  tags: z.array(z.string()),
  originalUrl: z.string().optional(),
  spaceId: z.string().optional(),
})
export type FormSchema = z.infer<typeof formSchema>

type EditPostFormProps = {
  postContent: PostContent
  postId: string
}

const InnerEditPostForm = ({ postContent, postId }: EditPostFormProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const myAddress = useMyMainAddress()
  const router = useRouter()
  const [isProcessingData, setIsProcessingData] = useState(false)
  const defaultValues = {
    image: postContent?.image ?? '',
    body: postContent?.body ?? '',
    title: postContent?.title ?? '',
    tags: postContent?.tags ?? [],
    originalUrl: postContent?.canonical ?? '',
  }

  const isUpdating = !!postContent

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

  const { mutateAsync, isLoading: isMutating } = useUpsertPost({
    onSuccess: async (_, data: any) => {
      if (!myAddress) return
      setIsProcessingData(true)

      const spaceId = await getDeterministicId({
        account: myAddress,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      if (spaceId) {
        await router.push(`/space/${spaceId}`)
      }
    },
  })

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (postContent && postId) {
      await mutateAsync({
        postId,
        ...data,
      })
    } else {
      await mutateAsync({
        // TODO: need to get the correct spaceId
        spaceId: data.spaceId || '',
        timestamp: Date.now(),
        uuid: crypto.randomUUID(),
        ...data,
      })
    }
  }

  const isLoading = isMutating || isProcessingData

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
      <div className='flex gap-4'>
        <EditorSection
          register={register}
          errors={errors}
          isLoading={isLoading}
          control={control}
          setValue={setValue}
        />
        <PostParamsSection
          formSchema={formSchema}
          watch={watch}
          errors={errors}
          register={register}
          setValue={setValue}
          control={control}
          isLoading={isLoading}
          isUpdating={isUpdating}
        />
      </div>
    </form>
  )
}

const EditPostForm = (props: EditPostFormProps) => {
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
        <InnerEditPostForm {...props} />
      </div>
    </DefaultLayout>
  )
}

export const EditPost = (props: EditPostFormProps) => {
  return <EditPostForm {...props} />
}

export const NewPost = EditPostForm
