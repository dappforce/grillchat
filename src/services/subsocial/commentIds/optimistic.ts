import { PostData } from '@subsocial/api/types'
import { QueryClient } from '@tanstack/react-query'
import { getPostQuery } from '../posts'
import { getCommentIdsQueryKey } from './query'
import { SendMessageParams } from './types'

type OptimisticGeneratorParam = {
  client: QueryClient
  param: SendMessageParams
  tempId: string
  address: string
}
export function addOptimisticData({
  client,
  param,
  tempId,
  address,
}: OptimisticGeneratorParam) {
  client.setQueryData(getPostQuery.getQueryKey(tempId), {
    id: tempId,
    struct: {
      createdAtTime: Date.now(),
      ownerId: address,
    },
    content: {
      body: param.message,
    },
  } as PostData)
  client.setQueryData<string[]>(
    getCommentIdsQueryKey(param.rootPostId),
    (ids) => {
      return [...(ids ?? []), tempId]
    }
  )
}
export function deleteOptimisticData({
  client,
  param,
  tempId,
}: OptimisticGeneratorParam) {
  client.removeQueries(getPostQuery.getQueryKey(tempId))
  client.setQueryData<string[]>(
    getCommentIdsQueryKey(param.rootPostId),
    (ids) => {
      return ids?.filter((id) => id !== tempId)
    }
  )
}
