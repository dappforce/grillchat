import { getUnapprovedMemesCountQuery } from '@/services/datahub/posts/query'

export default function UnapprovedMemeCount({ address }: { address: string }) {
  const { data: count, isLoading } =
    getUnapprovedMemesCountQuery.useQuery(address)
  if (isLoading) return null

  return (
    <div className='rounded-full bg-background-lightest px-1.5 py-0 text-xs'>
      {(count ?? 0) >= 3 ? '✅' : '🚫'} {count ?? 0}
    </div>
  )
}
