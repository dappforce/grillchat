import { getIdFromSlug } from '@/utils/slug'
import { useRouter } from 'next/router'
import { useDatahubModerationSubscriber } from './moderation/subscription'
import { useDatahubPostSubscriber } from './posts/subscription'

export function useDatahubSubscription() {
  const { query } = useRouter()
  const slugParam = (query?.slug || '') as string
  const chatId = getIdFromSlug(slugParam)

  useDatahubPostSubscriber(chatId)
  useDatahubModerationSubscriber()
}
