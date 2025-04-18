import { updateSpaceData } from '@/services/datahub/spaces/mutation'
import { getSpaceQuery } from '@/services/datahub/spaces/query'
import { MutationConfig } from '@/subsocial-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getCurrentWallet } from '../hooks'
import { createMutationWrapper } from '../utils/mutation'

export type HideUnhidePostParams = {
  spaceId: string
  action: 'hide' | 'unhide'
}
function useHideUnhideSpaceRaw(config?: MutationConfig<HideUnhidePostParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async ({ action, spaceId }: HideUnhidePostParams) => {
      await updateSpaceData({
        ...getCurrentWallet(),
        args: {
          spaceId,
          hidden: action === 'hide',
        },
      })
    },
    onMutate: (data) => {
      config?.onMutate?.(data)
      getSpaceQuery.setQueryData(client, data.spaceId, (post) => {
        if (!post) return post
        return {
          ...post,
          struct: {
            ...post.struct,
            hidden: data.action === 'hide',
          },
        }
      })
    },
    onError: (_, data, __) => {
      config?.onError?.(_, data, __)
      getSpaceQuery.invalidate(client, data.spaceId)
    },
    onSuccess: (_, data, __) => {
      config?.onSuccess?.(_, data, __)
      getSpaceQuery.invalidate(client, data.spaceId)
    },
  })
}
export const useHideUnhideSpace = createMutationWrapper(
  useHideUnhideSpaceRaw,
  'Failed to hide/unhide space'
)
