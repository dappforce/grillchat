import { getUnapprovedMemesCountQuery } from '@/services/datahub/posts/query'

export default function UnapprovedMemeCount({
  address,
  chatId,
}: {
  address: string
  chatId: string
}) {
  const { data: count, isLoading } = getUnapprovedMemesCountQuery.useQuery({
    address,
    chatId,
  })
  if (isLoading) return null

  return (
    <div className='rounded-full bg-background-lightest px-1.5 py-0 text-xs'>
      {(count ?? 0) >= 3 ? '✅' : '🚫'} {count ?? 0}
    </div>
  )
}
