import AutofocusWrapper from '@/components/AutofocusWrapper'
import Button from '@/components/Button'
import DataCard from '@/components/DataCard'
import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import MediaLoader from '@/components/MediaLoader'
import Modal, {
  ModalFunctionalityProps,
  ModalProps,
} from '@/components/modals/Modal'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import { getAliasFromHubId } from '@/constants/hubs'
import { getPostQuery } from '@/services/api/query'
import { UpsertChatWrapper } from '@/services/subsocial/posts/mutation'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostData } from '@subsocial/api/types'
import { getNewIdsFromEvent } from '@subsocial/api/utils'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import urlJoin from 'url-join'
import { z } from 'zod'

type InsertAdditionalProps = {
  hubId: string
  onCloseSuccessModal?: () => void
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
  const { chat, hubId, onCloseSuccessModal, onSuccess, ...otherProps } =
    props as UpsertChatModalProps &
      Partial<InsertAdditionalProps & UpdateAdditionalProps>

  const [createdPostId, setCreatedPostId] = useState('')

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
    if (props.isOpen) {
      reset({
        image: chat?.content?.image,
        body: chat?.content?.body,
        title: chat?.content?.title,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const isUpdating = !!chat
  const usedTexts = isUpdating ? texts.update : texts.insert

  return (
    <>
      <Modal
        {...otherProps}
        isOpen={otherProps.isOpen && !createdPostId}
        title={usedTexts.title}
        withCloseButton
      >
        <UpsertChatWrapper
          config={{
            txCallbacks: {
              onSuccess: (_data, _, txResult) => {
                if (isUpdating) return

                const [newId] = getNewIdsFromEvent(txResult)
                setCreatedPostId(newId.toString())
                props.closeModal()
              },
            },
          }}
          loadingUntilTxSuccess
        >
          {({ isLoading, mutateAsync, loadingText }) => {
            const onSubmit: SubmitHandler<FormSchema> = async (data) => {
              await mutateAsync({ spaceId: hubId, postId: chat?.id, ...data })
              onSuccess?.()
              if (isUpdating) props.closeModal()
            }

            return (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-4'
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
                  size='lg'
                  loadingText={loadingText}
                >
                  {usedTexts.button}
                </FormButton>
              </form>
            )
          }}
        </UpsertChatWrapper>
      </Modal>

      <InsertSuccessModal
        isOpen={!!createdPostId}
        closeModal={() => {
          setCreatedPostId('')
          onCloseSuccessModal?.()
        }}
        chatId={createdPostId}
        hubId={hubId ?? ''}
      />
    </>
  )
}

type InsertSuccessModalProps = ModalFunctionalityProps & {
  chatId: string
  hubId: string
}
function InsertSuccessModal({
  chatId,
  hubId,
  ...props
}: InsertSuccessModalProps) {
  const { data, isLoading } = getPostQuery.useQuery(chatId)
  const { IntegratedSkeleton } = useIntegratedSkeleton(isLoading)

  const chatLink = urlJoin(
    getCurrentUrlOrigin(),
    getChatPageLink(
      { query: {} },
      createSlug(chatId, data?.content),
      getAliasFromHubId(hubId) || hubId
    )
  )

  return (
    <Modal {...props} title='🎉 Chat Created' withCloseButton>
      <div className='flex flex-col items-center gap-6'>
        <MediaLoader
          containerClassName='h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden'
          className='h-full w-full object-cover'
          src={data?.content?.image ?? ''}
          width={100}
          height={100}
          alt=''
        />
        <IntegratedSkeleton content={data?.content?.title} className='text-xl'>
          {(title) => <p className='text-center text-xl'>{title}</p>}
        </IntegratedSkeleton>
        <DataCard
          data={[
            {
              title: 'Chat link',
              content: chatLink,
              openInNewTab: true,
              redirectTo: chatLink,
              textToCopy: chatLink,
            },
          ]}
        />
        <Button
          className='self-stretch'
          size='lg'
          onClick={() =>
            openNewWindow(
              twitterShareUrl(chatLink, 'I just created new chat! Join here!')
            )
          }
        >
          Tweet about it!
        </Button>
      </div>
    </Modal>
  )
}
