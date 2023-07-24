import { getModerationReasonsQuery } from '@/services/api/moderation/query'
import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '../Button'
import SelectInput, { ListItem } from '../inputs/SelectInput'
import ProfilePreview from '../ProfilePreview'

export type ModerationFormProps = ComponentProps<'form'> & {
  messageId: string
}

const formSchema = z.object({
  contentType: z.enum(['message', 'user', 'content']),
  blockingContent: z.object({ id: z.string(), label: z.string() }),
  reason: z.object({ id: z.string(), label: z.string() }),
})
type FormSchema = z.infer<typeof formSchema>

const blockingContentOptions: ListItem[] = [
  { id: 'message', label: 'Message' },
  { id: 'owner', label: 'Owner' },
  { id: 'content', label: 'Content' },
]

export default function ModerationForm({
  messageId,
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

  const { data: message } = getPostQuery.useQuery(messageId)
  const ownerId = message?.struct.ownerId ?? ''

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
    defaultValues: {
      blockingContent: blockingContentOptions[0],
      reason: reasonsMapped[0],
    },
  })

  return (
    <form className='flex flex-col gap-6'>
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
              items={blockingContentOptions}
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
              items={reasonsMapped}
              selected={field.value}
              setSelected={(item) => field.onChange(item)}
            />
          )
        }}
      />
      <Button type='submit' size='lg'>
        Moderate
      </Button>
    </form>
  )
}
