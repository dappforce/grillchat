import { getPostQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ProfilePreview from '../ProfilePreview'

export type ModerationFormProps = ComponentProps<'form'> & {
  messageId: string
}

const formSchema = z.object({
  contentType: z.enum(['message', 'user', 'content']),
  reason: z.string(),
})
type FormSchema = z.infer<typeof formSchema>

export default function ModerationForm({
  messageId,
  ...props
}: ModerationFormProps) {
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
  })

  return (
    <form>
      <div className={cx('mb-6 mt-2 rounded-2xl bg-background-lighter p-4')}>
        <ProfilePreview
          address={ownerId}
          avatarClassName='h-12 w-12'
          withGrillAddress={false}
        />
      </div>
    </form>
  )
}
