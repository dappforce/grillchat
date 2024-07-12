import { getSocialProfileQuery } from '@/services/datahub/identity/query'

export default function UnapprovedUserChip({
  address,
  chatId,
}: {
  address: string
  chatId: string
}) {
  const { data, isLoading } = getSocialProfileQuery.useQuery(address)
  if (isLoading || data?.allowedCreateCommentRootPostIds.includes(chatId))
    return null
  return <span>⏳</span>
}
