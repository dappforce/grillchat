import { ApiDatahubSpaceMutationBody } from '@/pages/api/datahub/space'
import { apiInstance } from '@/services/api/utils'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { createMutationWrapper } from '@/services/subsocial/utils/mutation'
import { getMyMainAddress } from '@/stores/my-account'
import { MutationConfig } from '@/subsocial-query'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SpaceContent } from '@subsocial/api/types'
import {
  CreateSpaceCallParsedArgs,
  FollowSpaceCallParsedArgs,
  UnfollowSpaceCallParsedArgs,
  UpdateSpaceCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDeterministicId } from '../posts/mutation'
import { DatahubParams, createSignedSocialDataEvent } from '../utils'
import { getSpaceIdsByFollower, getSpaceQuery } from './query'

function getPermission(allAllowed = false) {
  return {
    CreateComments: true,
    CreatePosts: allAllowed,
    CreateSubspaces: allAllowed,
    DeleteAnyPost: allAllowed,
    DeleteAnySubspace: allAllowed,
    DeleteOwnComments: true,
    DeleteOwnPosts: true,
    DeleteOwnSubspaces: true,
    Downvote: true,
    HideAnyComment: allAllowed,
    HideAnyPost: allAllowed,
    HideAnySubspace: allAllowed,
    HideOwnComments: true,
    HideOwnPosts: true,
    HideOwnSubspaces: true,
    ManageRoles: allAllowed,
    OverridePostPermissions: allAllowed,
    OverrideSubspacePermissions: allAllowed,
    RepresentSpaceExternally: allAllowed,
    RepresentSpaceInternally: allAllowed,
    Share: true,
    SuggestEntityStatus: allAllowed,
    UpdateAnyPost: false,
    UpdateAnySubspace: allAllowed,
    UpdateEntityStatus: allAllowed,
    UpdateOwnComments: true,
    UpdateOwnPosts: true,
    UpdateOwnSubspaces: true,
    UpdateSpace: allAllowed,
    UpdateSpaceSettings: allAllowed,
    Upvote: true,
  }
}

export async function createSpaceData(
  params: DatahubParams<{
    cid?: string
    content: SpaceContent
  }>
) {
  const { args } = params
  const { content, cid } = args
  const eventArgs: CreateSpaceCallParsedArgs = {
    forced: false,
    ipfsSrc: cid,
    forcedData: null,
    permissions: {
      spaceOwner: getPermission(true),
      everyone: getPermission(),
      follower: getPermission(),
      none: getPermission(),
    },
  }

  const input = await createSignedSocialDataEvent(
    socialCallName.create_space,
    params,
    eventArgs,
    content
  )

  await apiInstance.post<any, any, ApiDatahubSpaceMutationBody>(
    '/api/datahub/space',
    {
      action: 'create-space',
      payload: input as any,
    }
  )
}

export async function updateSpaceData(
  params: DatahubParams<{
    spaceId: string
    cid?: string
    content: SpaceContent
  }>
) {
  const { args } = params
  const { content, cid, spaceId } = args
  const eventArgs: UpdateSpaceCallParsedArgs = {
    spaceId,
    ipfsSrc: cid,
  }

  const input = await createSignedSocialDataEvent(
    socialCallName.update_space,
    params,
    eventArgs,
    content
  )

  await apiInstance.post<any, any, ApiDatahubSpaceMutationBody>(
    '/api/datahub/space',
    {
      action: 'update-space',
      payload: input as any,
    }
  )
}

export async function followSpace(
  params: DatahubParams<{
    spaceId: string
  }>
) {
  const { args } = params
  const { spaceId } = args
  const eventArgs: FollowSpaceCallParsedArgs = {
    spaceId,
  }

  const input = await createSignedSocialDataEvent(
    socialCallName.follow_space,
    params,
    eventArgs
  )

  await apiInstance.post<any, any, ApiDatahubSpaceMutationBody>(
    '/api/datahub/space',
    {
      action: 'follow-space',
      payload: input as any,
    }
  )
}

export async function unfollowSpace(
  params: DatahubParams<{
    spaceId: string
  }>
) {
  const { args } = params
  const { spaceId } = args
  const eventArgs: UnfollowSpaceCallParsedArgs = {
    spaceId,
  }

  const input = await createSignedSocialDataEvent(
    socialCallName.unfollow_space,
    params,
    eventArgs
  )

  await apiInstance.post<any, any, ApiDatahubSpaceMutationBody>(
    '/api/datahub/space',
    {
      action: 'unfollow-space',
      payload: input as any,
    }
  )
}

type CommonParams = {
  content: {
    name?: string
    image?: string
    about?: string
    tags?: string[]
    email?: string
  }
}
export type UpsertSpaceParams =
  | (CommonParams & Required<Pick<DatahubParams<{}>, 'timestamp' | 'uuid'>>)
  | (CommonParams & { spaceId: string })
function checkAction(data: UpsertSpaceParams) {
  if ('spaceId' in data) {
    return { payload: data, action: 'update' } as const
  }

  return { payload: data, action: 'create' } as const
}
async function getMutatedSpaceId(data: UpsertSpaceParams) {
  const { payload, action } = checkAction(data)
  if (action === 'update') return payload.spaceId
  return await getDeterministicId({
    timestamp: payload.timestamp.toString(),
    uuid: payload.uuid,
    account: getMyMainAddress() ?? '',
  })
}
function useUpsertSpaceRaw(config?: MutationConfig<UpsertSpaceParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: UpsertSpaceParams) => {
      const { content } = params
      const currentWallet = getCurrentWallet()
      if (!currentWallet.address) throw new Error('Please login')

      const { payload, action } = checkAction(params)

      if (action === 'create') {
        createSpaceData({
          ...currentWallet,
          uuid: payload.uuid,
          timestamp: payload.timestamp,
          args: { content: content as any },
        })
      } else if (action === 'update') {
        updateSpaceData({
          ...currentWallet,
          args: { content: content as any, spaceId: payload.spaceId },
        })
      }
    },
    onMutate: async (data) => {
      config?.onMutate?.(data)
      preventWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''
      const spaceId = await getMutatedSpaceId(data)

      getSpaceQuery.setQueryData(client, spaceId, (oldData) => {
        const oldSpaceContent = oldData?.content || {}
        return {
          id: spaceId,
          struct: {
            ...oldData?.struct,
            createdByAccount: mainAddress,
            canEveryoneCreatePosts: false,
            canFollowerCreatePosts: false,
            createdAtBlock: 0,
            createdAtTime: Date.now(),
            hidden: false,
            id: spaceId,
            ownerId: mainAddress,
          },
          content: {
            ...oldSpaceContent,
            ...data.content,
          } as SpaceContent,
        }
      })
    },
    onError: async (_, data, __) => {
      config?.onError?.(_, data, __)
      const spaceId = await getMutatedSpaceId(data)
      getSpaceQuery.invalidate(client, spaceId)
    },
    onSuccess: async (_, data, __) => {
      config?.onSuccess?.(_, data, __)
      allowWindowUnload()
      const spaceId = await getMutatedSpaceId(data)
      getSpaceQuery.invalidate(client, spaceId)
    },
  })
}
export const useUpsertSpace = createMutationWrapper(
  useUpsertSpaceRaw,
  'Failed to upsert space'
)

type FollowSpaceParams = Required<
  Pick<DatahubParams<{}>, 'timestamp' | 'uuid'>
> & {
  spaceId: string
}

function useFollowSpaceRaw(config?: MutationConfig<FollowSpaceParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: FollowSpaceParams) => {
      const { spaceId } = params
      const currentWallet = getCurrentWallet()
      if (!currentWallet.address) throw new Error('Please login')

      followSpace({
        ...currentWallet,
        uuid: params.uuid,
        timestamp: params.timestamp,
        args: { spaceId },
      })
    },
    onMutate: async (data) => {
      config?.onMutate?.(data)
      preventWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''

      getSpaceIdsByFollower.setQueryData(client, mainAddress, (oldData) => {
        return [...(oldData || []), data.spaceId] as string[]
      })
    },
    onError: async (_, data, __) => {
      config?.onError?.(_, data, __)
    },
    onSuccess: async (_, data, __) => {
      config?.onSuccess?.(_, data, __)
      allowWindowUnload()
    },
  })
}
export const useFollowSpace = createMutationWrapper(
  useFollowSpaceRaw,
  'Failed to follow space'
)

function useUnFollowSpaceRaw(config?: MutationConfig<FollowSpaceParams>) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: FollowSpaceParams) => {
      const { spaceId } = params
      const currentWallet = getCurrentWallet()
      if (!currentWallet.address) throw new Error('Please login')

      unfollowSpace({
        ...currentWallet,
        uuid: params.uuid,
        timestamp: params.timestamp,
        args: { spaceId },
      })
    },
    onMutate: async (data) => {
      config?.onMutate?.(data)
      preventWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''

      getSpaceIdsByFollower.setQueryData(client, mainAddress, (oldData) => {
        return oldData?.filter((id) => id !== data.spaceId) as string[]
      })
    },
    onError: async (_, data, __) => {
      config?.onError?.(_, data, __)
    },
    onSuccess: async (_, data, __) => {
      config?.onSuccess?.(_, data, __)
      allowWindowUnload()
    },
  })
}
export const useUnFollowSpace = createMutationWrapper(
  useUnFollowSpaceRaw,
  'Failed to unfollow space'
)
