import useToastError from '@/hooks/useToastError'
import { useModerationActions } from '@/old/services/datahub/moderation/mutation'
import { getModerationReasonsQuery } from '@/old/services/datahub/moderation/query'
import { getPostQuery } from '@/services/api/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { SocialCallDataArgs } from '@subsocial/data-hub-sdk'
import { ComponentProps, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  HiMiniArrowUturnLeft,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'
import { z } from 'zod'
import FormButton from '../FormButton'
import LinkText from '../LinkText'
import { useName } from '../Name'
import Toast from '../Toast'
import SelectInput, { ListItem } from '../inputs/SelectInput'

export type ModerationFormProps = ComponentProps<'form'> & {
  messageId: string
  chatId?: string
  isFromWidget?: boolean
  onSuccess?: () => void
}

const formSchema = z.object({
  blockingContent: z.object({
    id: z.literal('message').or(z.literal('owner')),
    label: z.string(),
  }),
  reason: z.object({ id: z.string(), label: z.string() }),
})
type FormSchema = z.infer<typeof formSchema>

const blockingContentOptions = (isOwner?: boolean) => {
  const options: {
    id: FormSchema['blockingContent']['id']
    label: string
    disabledItem?: boolean | string
  }[] = [{ id: 'message', label: 'Moderate message' }]

  if (!isOwner) {
    options.push({
      id: 'owner',
      label: 'Moderate all messages from sender',
    })
  }
  return options
}

export default function ModerationForm({
  messageId,
  chatId,
  onSuccess,
  isFromWidget,
  ...props
}: ModerationFormProps) {
  const sendEvent = useSendEvent()
  const { data: reasons } = getModerationReasonsQuery.useQuery(null)
  const reasonsMapped = useMemo(
    () =>
      reasons?.map<ListItem>((reason) => ({
        id: reason.id + '',
        label: reason.reasonText,
      })) ?? [],
    [reasons]
  )

  const { data: message, isLoading: isLoadingPost } =
    getPostQuery.useQuery(messageId)
  const ownerId = message?.struct.ownerId ?? ''

  const { name } = useName(ownerId)

  const myAddress = useMyMainAddress()
  const { mutate, isLoading, error } = useModerationActions({
    onSuccess: (_, variables) => {
      if (variables.callName === 'synth_moderation_block_resource') {
        const args =
          variables.args as SocialCallDataArgs<'synth_moderation_block_resource'>
        const isBlockingOwner = args.resourceId === ownerId
        const undo = () =>
          mutate({
            withoutRevalidateCurrentPath: isFromWidget,
            callName: 'synth_moderation_unblock_resource',
            args: {
              resourceId: args.resourceId,
              ctxPostIds: ['*'],
              ctxAppIds: ['*'],
            },
          })

        toast.custom((t) => (
          <Toast
            t={t}
            icon={(classNames) => (
              <HiOutlineInformationCircle className={classNames} />
            )}
            title={
              <span>
                You have blocked the {!isBlockingOwner ? 'message from ' : ''}
                user {name}
              </span>
            }
            action={
              <LinkText
                onClick={() => {
                  undo()
                  toast.dismiss(t.id)
                }}
                variant='primary'
                className='flex items-center gap-1 text-sm'
              >
                <HiMiniArrowUturnLeft /> Undo
              </LinkText>
            }
          />
        ))
      } else if (variables.callName === 'synth_moderation_unblock_resource') {
        toast.custom((t) => (
          <Toast
            t={t}
            icon={(classNames) => (
              <HiOutlineInformationCircle className={classNames} />
            )}
            title='Undo moderation success'
          />
        ))
      }
      onSuccess?.()
    },
  })
  useToastError(error, 'Failed to moderate message')

  const { control, handleSubmit, setValue, watch } = useForm<FormSchema>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockingContent: blockingContentOptions()[0],
      reason: reasonsMapped[0],
    },
  })

  useEffect(() => {
    if (reasonsMapped.length > 0) {
      setValue('reason', reasonsMapped[0])
    }
  }, [reasonsMapped, setValue])

  if (!myAddress) return null

  const isOwner = ownerId ? ownerId === myAddress : true

  return (
    <form
      {...props}
      className={cx('flex flex-col gap-6', props.className)}
      onSubmit={handleSubmit((data) => {
        const { blockingContent, reason } = data
        let resourceId: string
        switch (blockingContent.id) {
          case 'message':
            resourceId = messageId
            break
          case 'owner':
            resourceId = ownerId
            break
          default:
            throw new Error('Invalid blocking content')
        }

        const reasonId = reason.id

        mutate({
          withoutRevalidateCurrentPath: isFromWidget,
          callName: 'synth_moderation_block_resource',
          args: {
            reasonId,
            resourceId,
            ctxPostIds: ['*'],
            ctxAppIds: ['*'],
          },
        })

        sendEvent('client_moderation', {
          eventSource: 'moderate-action',
          chatId,
          reasonId,
          resourceType: blockingContent.id,
        })
      })}
    >
      {/* <div className='flex flex-col gap-2'>
        <span className='text-sm text-text-muted'>Message Owner</span>
        <div
          className={cx(
            'rounded-xl border border-border-gray bg-background px-4 py-2'
          )}
        >
          <div className='flex items-center justify-between'>
            <ProfilePreview
              address={ownerId}
              avatarClassName={cx('h-8 w-8')}
              nameClassName={cx('text-base')}
              showAddress={false}
            />
            {isOwner && (
              <span className='text-xs text-text-muted'>Chat owner</span>
            )}
          </div>
        </div>
      </div> */}
      <Controller
        control={control}
        name='blockingContent'
        render={({ field }) => {
          return (
            <SelectInput
              fieldLabel='Action'
              disabled={isLoading}
              items={blockingContentOptions(isOwner)}
              selected={field.value}
              setSelected={(item) => field.onChange(item)}
            />
          )
        }}
      />
      <Controller
        control={control}
        name='reason'
        render={({ field }) => {
          return (
            <SelectInput
              fieldLabel='Reason'
              disabled={isLoading}
              items={reasonsMapped}
              selected={field.value}
              placeholder='Loading...'
              setSelected={(item) => field.onChange(item)}
            />
          )
        }}
      />
      <FormButton
        schema={formSchema}
        watch={watch}
        size='lg'
        disabled={isLoadingPost}
        isLoading={isLoading}
      >
        Moderate
      </FormButton>
    </form>
  )
}
