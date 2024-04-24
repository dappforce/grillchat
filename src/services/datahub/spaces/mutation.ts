import { ApiDatahubSpaceMutationBody } from '@/pages/api/datahub/space'
import { invalidateProfileServerCache } from '@/services/api/mutation'
import { getProfileQuery } from '@/services/api/query'
import { apiInstance } from '@/services/api/utils'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { createMutationWrapper } from '@/services/subsocial/utils/mutation'
import { getMyMainAddress } from '@/stores/my-account'
import { TransactionMutationConfig } from '@/subsocial-query/subsocial/types'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { SpaceContent } from '@subsocial/api/types'
import {
  CreateSpaceCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DatahubParams, createSignedSocialDataEvent } from '../utils'
import { getSpaceQuery } from './query'

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

  const input = createSignedSocialDataEvent(
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

// async function updatePostData(
//   params: DatahubParams<{
//     postId: string
//     changes: {
//       content?: {
//         cid: string
//         content: PostContent
//       }
//       hidden?: boolean
//     }
//   }>
// ) {
//   const { postId, changes } = params.args
//   const { content, hidden } = changes
//   const eventArgs: UpdatePostCallParsedArgs = {
//     spaceId: null,
//     hidden: hidden ?? null,
//     postId,
//     ipfsSrc: content?.cid ?? null,
//   }
//   const input = createSignedSocialDataEvent(
//     socialCallName.update_post,
//     params,
//     eventArgs,
//     content?.content
//   )

//   await apiInstance.post<any, any, ApiDatahubPostMutationBody>(
//     '/api/datahub/post',
//     {
//       action: 'update-post',
//       payload: input as any,
//     }
//   )
// }

type Params = SendMessageParams & {
  uuid: string
  timestamp: number
}
export function generateSendMessageParam(params: SendMessageParams) {
  return {
    ...params,
    uuid: crypto.randomUUID(),
    timestamp: Date.now(),
  }
}

type CommonParams = {
  content: {
    name?: string
    image?: string
    about?: string
  }
}
export type UpsertSpaceParams =
  | CommonParams
  | (CommonParams & { spaceId: string })
function checkAction(data: UpsertSpaceParams) {
  if ('spaceId' in data && data.spaceId) {
    return { payload: data, action: 'update' } as const
  }

  return { payload: data, action: 'create' } as const
}
const OPTIMISTIC_SPACE_ID = 'optimistic-space-id'
function useUpsertSpaceRaw(
  config?: TransactionMutationConfig<UpsertSpaceParams>
) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (params: UpsertSpaceParams) => {
      const { content } = params
      const currentWallet = getCurrentWallet()
      if (!currentWallet.address) throw new Error('Please login')

      const { payload, action } = checkAction(params)
      if (action === 'update' && payload.spaceId === OPTIMISTIC_SPACE_ID)
        throw new Error(
          'Please wait until we finalized your previous name change'
        )

      if (action === 'create') {
        createSpaceData({
          ...currentWallet,
          args: { content: content as any },
        })
      } else if (action === 'update') {
        // TODO: implement
        throw new Error('Not implemented')
      }
    },
    onMutate: (data) => {
      preventWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''
      getSpaceQuery.setQueryData(client, mainAddress, (oldData) => {
        const oldSpaceId = oldData?.id
        const oldSpaceContent = oldData?.content || {}
        const id = oldSpaceId ? oldSpaceId : OPTIMISTIC_SPACE_ID
        return {
          id,
          struct: {
            ...oldData?.struct,
            createdByAccount: mainAddress,
            canEveryoneCreatePosts: false,
            canFollowerCreatePosts: false,
            createdAtBlock: 0,
            createdAtTime: Date.now(),
            hidden: false,
            id,
            ownerId: mainAddress,
          },
          content: {
            ...oldSpaceContent,
            ...data.content,
          } as SpaceContent,
        }
      })
    },
    onError: async () => {
      const mainAddress = getMyMainAddress() ?? ''
      getProfileQuery.invalidate(client, mainAddress)
    },
    onSuccess: async () => {
      allowWindowUnload()
      const mainAddress = getMyMainAddress() ?? ''
      await invalidateProfileServerCache(mainAddress)
      // Remove invalidation because the data will be same, and sometimes IPFS errors out, making the profile gone
      // getProfileQuery.invalidate(client, address)
    },
  })
}
export const useUpsertSpace = createMutationWrapper(
  useUpsertSpaceRaw,
  'Failed to upsert space'
)
