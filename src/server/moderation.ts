import {
  getBlockedAddressesQuery,
  getBlockedCidsQuery,
  getBlockedMessageIdsInChatIdQuery,
} from '@/services/moderation/query'
import { QueryClient } from '@tanstack/react-query'

export async function prefetchBlockedEntities(
  queryClient: QueryClient,
  hubId: string,
  chatIds: string[]
) {
  try {
    return await Promise.all([
      getBlockedCidsQuery.fetchQuery(queryClient, { hubId }),
      getBlockedAddressesQuery.fetchQuery(queryClient, { hubId }),
      ...chatIds.map((chatId) =>
        getBlockedMessageIdsInChatIdQuery.fetchQuery(queryClient, {
          chatId,
          hubId,
        })
      ),
    ])
  } catch (err) {
    console.log('Error prefetching blocked entities', err)
  }
}
