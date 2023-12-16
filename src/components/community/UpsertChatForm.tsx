import AutofocusWrapper from '@/components/AutofocusWrapper'
import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import { useSelectedMediaContext } from '@/context/MediaFormContext'
import { usePinToIpfs } from '@/hooks/usePinToIpfs'
import {
  JoinChatWrapper,
  UpsertPostWrapper,
} from '@/services/subsocial/posts/mutation'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { getNewIdFromTxResult } from '@/utils/blockchain'
import { cx } from '@/utils/class-names'
import { getChatPageLink } from '@/utils/links'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { ComponentProps, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import urlJoin from 'url-join'
import { z } from 'zod'
type InsertAdditionalProps = {
  hubId: string
}
type UpdateAdditionalProps = {
  chat: PostData
}
export type UpsertChatFormProps = ComponentProps<'form'> &
  (InsertAdditionalProps | UpdateAdditionalProps) & {
    onSuccess?: () => void
    onTxSuccess?: () => void
  }

const formSchema = z.object({
  image: z.string(),
  title: z.string().nonempty('Name cannot be empty'),
  body: z.string(),
  video: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export default function UpsertChatForm(props: UpsertChatFormProps) {
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [isProcessingData, setIsProcessingData] = useState(false)
  const [vidImae, setvidImae] = useState(' this is video  title')
  const [vidtitle, setvidtitle] = useState('this  is video image')
  const [videoCid, setvideoCid] = useState('this  is video cid')
  const [isUploadingVideo, setisUploadingVideo] = useState(false)
  const sendEvent = useSendEvent()
  const {
    selectedVideo,
    setSelectedVideo,
    selectedImage,
    setSelectedImage,
    selectedVideoCID,
    setselectedVideoCID,
  } = useSelectedMediaContext()
  const { uploadToIpfs, isUploading, isUploadingError } = usePinToIpfs()

  const handleVideoChange = (event) => {
    //const video = event.target.files[0];
    setSelectedVideo('hello  world')
  }

  console.log('the selected video', selectedVideo)
  const theData = {
    image: vidImae,
    title: vidtitle,
    body: videoCid,
  }

  const router = useRouter()
  const { chat, hubId, onSuccess, onTxSuccess, ...otherProps } =
    props as UpsertChatFormProps &
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

  console.log('selected video cid', selectedVideoCID)
  console.log('the selected image cid', selectedImage)

  return (
    <JoinChatWrapper>
      {({ mutateAsync }) => (
        <UpsertPostWrapper
          config={{
            txCallbacks: {
              onSuccess: async (_data, txResult) => {
                if (isUpdating || !myAddress) return

                setIsProcessingData(true)
                const chatId = await getNewIdFromTxResult(txResult)
                mutateAsync({ chatId })

                sendEvent(
                  'community_chat_created',
                  { hubId },
                  { ownedChat: true }
                )

                await router.push(
                  urlJoin(
                    getChatPageLink({ query: {} }, chatId, hubId),
                    '?new=true'
                  )
                )
                setIsProcessingData(false)

                onTxSuccess?.()
              },
            },
          }}
          loadingUntilTxSuccess={!isUpdating}
        >
          {({ isLoading: isMutating, mutateAsync }) => {
            const onSubmit: SubmitHandler<FormSchema> = async (data) => {
              if (!isUpdating) {
                sendEvent('start_community_chat_creation')
              }

              console.log('Form data:', data)

              // Check if the video property exists in the data object
              if ('video' in data) {
                console.log(
                  'Video URL is included in the form data:',
                  data.video
                )
              }
              // setisUploadingVideo(true)
              //const videoCID = await uploadToIpfs(selectedVideo);
              //  setselectedVideoCID(videoCID)
              // setisUploadingVideo(false)
              await mutateAsync({
                spaceId: hubId,
                postId: chat?.id,
                ...data,
              })
              onSuccess?.()
            }

            const isLoading = isMutating || isProcessingData

            return (
              <>
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

                    <TextArea
                      {...register('video')}
                      disabled={isLoading}
                      placeholder='The video (optional)'
                      error={errors.body?.message}
                      rows={3}
                      variant='fill-bg'
                    />
                  </div>

                  <FormButton
                    schema={formSchema}
                    watch={watch}
                    isLoading={isLoading}
                    disabled={isImageLoading}
                    loadingText={isUpdating ? 'Saving...' : 'Creating...'}
                    size='lg'
                  >
                    {isUploadingVideo ? 'Uploading video' : actionText}
                  </FormButton>
                </form>
              </>
            )
          }}
        </UpsertPostWrapper>
      )}
    </JoinChatWrapper>
  )
}
