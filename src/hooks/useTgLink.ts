import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityFromMainAddressQuery } from '@/services/datahub/identity/query'
import { getUserTelegramLink } from '@/utils/links'
import useIsModerationAdmin from './useIsModerationAdmin'

export default function useTgLink(address: string, asLink?: boolean) {
  const isAdmin = useIsModerationAdmin()
  const shouldRedirect = !!(asLink && isAdmin)
  const { data: linkedIdentity, isLoading } =
    getLinkedIdentityFromMainAddressQuery.useQuery(address, {
      enabled: shouldRedirect,
    })

  const telegramProvider = linkedIdentity?.externalProviders.find(
    (p) => p.provider === IdentityProvider.Telegram
  )
  const telegramLink = shouldRedirect
    ? getUserTelegramLink(linkedIdentity)
    : undefined

  return {
    telegramLink,
    telegramUsername: telegramProvider?.username,
    isLoading: shouldRedirect && isLoading,
    isAdmin,
  }
}
