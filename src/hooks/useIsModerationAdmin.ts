import { env } from '@/env.mjs'
import { getModeratorQuery } from '@/services/datahub/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'

export default function useIsModerationAdmin(address?: string) {
  const myAddress = useMyMainAddress()
  const usedAddress = address ?? myAddress
  const { data: moderator } = getModeratorQuery.useQuery(usedAddress ?? '')

  const isAdmin = moderator?.appIds.includes(env.NEXT_PUBLIC_APP_ID)

  return isAdmin
}
