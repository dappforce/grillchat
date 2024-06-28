import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityFromMainAddressQuery } from '@/services/datahub/identity/query'
import { getUserTelegramLink } from '@/utils/links'
import useIsModerationAdmin from './useIsModerationAdmin'

export default function useTgLink(address: string, asLink?: boolean) {
  const isAdmin = useIsModerationAdmin()
  const shouldSeeUsername = !!(asLink && isAdmin)
  const { data: linkedIdentity, isLoading } =
    getLinkedIdentityFromMainAddressQuery.useQuery(address, {
      enabled: shouldSeeUsername,
    })

  const telegramProvider = linkedIdentity?.externalProviders.find(
    (p) => p.provider === IdentityProvider.Telegram
  )
  const telegramLink = shouldSeeUsername
    ? getUserTelegramLink(linkedIdentity)
    : undefined

  return {
    telegramLink,
    telegramUsername: telegramProvider?.username,
    isLoading: shouldSeeUsername && isLoading,
    shouldSeeUsername,
  }
}
