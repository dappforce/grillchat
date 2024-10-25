import { getIdFromSlug } from '@/utils/slug'
import { useRouter } from 'next/router'
import { useDatahubBalancesSubscriber } from './balances/subscription'
import { useDatahubContentStakingSubscriber } from './content-staking/subscription'
import { useDatahubEventsSubscriber } from './events/subscription'
import { useDatahubExternalTokenBalancesSubscriber } from './externalTokenBalances/subscription'
import { useDatahubIdentitySubscriber } from './identity/subscription'
import { useDatahubModerationSubscriber } from './moderation/subscription'
import { useDatahubPostSubscriber } from './posts/subscription'

export function useDatahubSubscription() {
  const { query } = useRouter()
  const slugParam = (query?.slug || '') as string
  const chatId = getIdFromSlug(slugParam)

  useDatahubPostSubscriber(chatId)
  useDatahubModerationSubscriber()
  useDatahubIdentitySubscriber()
  useDatahubContentStakingSubscriber()
  useDatahubEventsSubscriber()
  useDatahubBalancesSubscriber()
  useDatahubExternalTokenBalancesSubscriber()
}
