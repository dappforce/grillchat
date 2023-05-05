import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedIdsInRootPostIdQuery,
} from '@/services/moderation/query'
import { QueryClient } from '@tanstack/react-query'

export function prefetchBlockedEntities(
  queryClient: QueryClient,
  chatIds: string[]
) {
  return Promise.all([
    getBlockedCidsQuery.fetchQuery(queryClient, null),
    getBlockedAddressesQuery.fetchQuery(queryClient, null),
    ...chatIds.map((id) =>
      getBlockedIdsInRootPostIdQuery.fetchQuery(queryClient, id)
    ),
  ])
}
