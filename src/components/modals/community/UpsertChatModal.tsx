import AutofocusWrapper from '@/components/AutofocusWrapper'
import FormButton from '@/components/FormButton'
import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import TextArea from '@/components/inputs/TextArea'
import Modal, {
  ModalFunctionalityProps,
  ModalProps,
} from '@/components/modals/Modal'
import {
  JoinChatWrapper,
  UpsertPostWrapper,
} from '@/services/subsocial/posts/mutation'
import { getChatPageLink } from '@/utils/links'
import { zodResolver } from '@hookform/resolvers/zod'
import { PostData } from '@subsocial/api/types'
import { getNewIdsFromEvent } from '@subsocial/api/utils'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import urlJoin from 'url-join'
import { z } from 'zod'

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
    onAfterRedirect?: () => void
  }

const formSchema = z.object({
  image: z.string(),
  title: z.string().nonempty('Name cannot be empty'),
  body: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export default function UpsertChatModal(props: UpsertChatModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const router = useRouter()
  const { chat, hubId, onSuccess, onAfterRedirect, ...otherProps } =
    props as UpsertChatModalProps &
      Partial<InsertAdditionalProps & UpdateAdditionalProps>

  const [createdPostId, setCreatedPostId] = useState('')

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
    reset,
    watch,
  } = useForm<FormSchema>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    if (props.isOpen) {
      reset(defaultValues)
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
    <Modal
      {...otherProps}
      isOpen={otherProps.isOpen && !createdPostId}
      title={usedTexts.title}
      withCloseButton
    >
      <JoinChatWrapper>
        {({ mutateAsync }) => (
          <UpsertPostWrapper
            config={{
              txCallbacks: {
                onSuccess: async (_data, _, txResult) => {
                  if (isUpdating) return

                  const [newId] = getNewIdsFromEvent(txResult)
                  const newIdString = newId.toString()

                  setCreatedPostId(newIdString)
                  mutateAsync({ chatId: newIdString })

                  setIsRedirecting(true)
                  await router.push(
                    urlJoin(
                      getChatPageLink({ query: {} }, newIdString, hubId),
                      '?new=true'
                    )
                  )
                  setIsRedirecting(false)

                  onAfterRedirect?.()
                },
              },
            }}
            loadingUntilTxSuccess
          >
            {({ isLoading: isMutating, mutateAsync, loadingText }) => {
              const onSubmit: SubmitHandler<FormSchema> = async (data) => {
                await mutateAsync({
                  spaceId: hubId,
                  postId: chat?.id,
                  ...data,
                })
                onSuccess?.()
                if (isUpdating) props.closeModal()
              }

              const isLoading = isMutating || isRedirecting

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
                    loadingText={isRedirecting ? 'Redirecting' : loadingText}
                  >
                    {usedTexts.button}
                  </FormButton>
                </form>
              )
            }}
          </UpsertPostWrapper>
        )}
      </JoinChatWrapper>
    </Modal>
  )
}
