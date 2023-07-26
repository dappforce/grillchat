import useToastError from '@/hooks/useToastError'
import { useCommitModerationAction } from '@/services/api/moderation/mutation'
import { getModerationReasonsQuery } from '@/services/api/moderation/query'
import { getPostQuery } from '@/services/api/query'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../FormButton'
import SelectInput, { ListItem } from '../inputs/SelectInput'
import ProfilePreview from '../ProfilePreview'

export type ModerationFormProps = ComponentProps<'form'> & {
  messageId: string
  chatId: string
  hubId: string
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
  }[] = [{ id: 'message', label: 'Message' }]

  if (!isOwner) {
    options.push({
      id: 'owner',
      label: 'Owner',
    })
  }
  return options
}

export default function ModerationForm({
  messageId,
  chatId,
  hubId,
  onSuccess,
  ...props
}: ModerationFormProps) {
  const { data: reasons } = getModerationReasonsQuery.useQuery(null)
  const reasonsMapped = useMemo(
    () =>
      reasons?.map<ListItem>((reason) => ({
        id: reason.id + '',
        label: reason.reasonText,
      })) ?? [],
    [reasons]
  )

  const myAddress = useMyAccount((state) => state.address)
  const { mutate, isLoading, error } = useCommitModerationAction({ onSuccess })
  useToastError(error, 'Failed to moderate message')

  const { data: message } = getPostQuery.useQuery(messageId)
  const ownerId = message?.struct.ownerId ?? ''

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

        mutate({
          action: 'block',
          address: myAddress,
          ctxPostId: chatId,
          reasonId: reason.id,
          resourceId,
        })
      })}
    >
      <div className='flex flex-col gap-2'>
        <span className='text-sm text-text-muted'>User</span>
        <div
          className={cx(
            'rounded-xl border border-border-gray bg-background px-4 py-2'
          )}
        >
          <ProfilePreview
            address={ownerId}
            avatarClassName={cx('h-8 w-8')}
            nameClassName={cx('text-base')}
            withGrillAddress={false}
            withEvmAddress={false}
          />
        </div>
      </div>
      <Controller
        control={control}
        name='blockingContent'
        render={({ field }) => {
          return (
            <SelectInput
              fieldLabel='Blocking content'
              disabled={isLoading}
              items={blockingContentOptions(ownerId === myAddress)}
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
        isLoading={isLoading}
      >
        Moderate
      </FormButton>
    </form>
  )
}
