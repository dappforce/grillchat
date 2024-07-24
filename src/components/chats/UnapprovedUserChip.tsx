import { getSocialProfileQuery } from '@/services/datahub/identity/query'
import { MdVerified } from 'react-icons/md'

export default function ApprovedUserChip({
  address,
  chatId,
}: {
  address: string
  chatId: string
}) {
  const { data, isLoading } = getSocialProfileQuery.useQuery(address)
  if (isLoading || !data?.allowedCreateCommentRootPostIds.includes(chatId))
    return null
  return (
    <div className='flex items-center'>
      <MdVerified className='text-blue-400' />
    </div>
  )
}
