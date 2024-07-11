import { getUnapprovedMemesCountQuery } from '@/services/datahub/posts/query'
import { cx } from '@/utils/class-names'

export default function UnapprovedMemeCount({
  address,
  chatId,
  className,
}: {
  address: string
  chatId: string
  className?: string
}) {
  const { data: count, isLoading } = getUnapprovedMemesCountQuery.useQuery({
    address,
    chatId,
  })
  if (isLoading) return null

  const approved = count?.approved ?? 0
  const unapproved = count?.unapproved ?? 0

  return (
    <div
      className={cx(
        'rounded-full bg-background-lightest px-1.5 py-0 text-sm',
        className
      )}
    >
      {`⏳ ${unapproved} / ✅ ${approved}`}
    </div>
  )
}
