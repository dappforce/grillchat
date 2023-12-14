import { getModeratorQuery } from '@/services/datahub/moderation/query'
import { useMyMainAddress } from '@/stores/my-account'
import { getAppId } from '@/utils/env/client'

export default function useIsModerationAdmin(address?: string) {
  const myAddress = useMyMainAddress()
  const usedAddress = address ?? myAddress
  const { data: moderator } = getModeratorQuery.useQuery(usedAddress ?? '')

  const isAdmin = moderator?.appIds.includes(getAppId())

  return isAdmin
}
