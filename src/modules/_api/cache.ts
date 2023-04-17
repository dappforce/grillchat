// TODO: posts cache may not work in this current implementation, because next js api are stateless which makes the posts cache will be remake every request.
// Currently, it doesn't work in dev mode, but works in build mode.
// Solution:
// 1. Use redis to store the cache

import {
  MinimalUsageQueue,
  MinimalUsageQueueWithTimeLimit,
} from '@/utils/data-structure'
import { PostStruct } from '@subsocial/api/types'
import { PostContent } from '@subsocial/api/types/dto'

// 2. Use squid for historical data, for newer data that are not in squid yet, fetch it from chain
const MAX_CACHE_ITEMS = 500_000
export const contentCache = new MinimalUsageQueue<PostContent | null>(
  MAX_CACHE_ITEMS
)
export const postsCache = new MinimalUsageQueueWithTimeLimit<PostStruct>(
  MAX_CACHE_ITEMS,
  15
)
