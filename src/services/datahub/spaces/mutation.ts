import { getMaxMessageLength } from '@/constants/chat'
import { ApiDatahubSpaceMutationBody } from '@/pages/api/datahub/space'
import { apiInstance } from '@/services/api/utils'
import { SendMessageParams } from '@/services/subsocial/commentIds'
import {
  addOptimisticData,
  deleteOptimisticData,
} from '@/services/subsocial/commentIds/optimistic'
import { getCurrentWallet } from '@/services/subsocial/hooks'
import { ParentPostIdWrapper, ReplyWrapper } from '@/utils/ipfs'
import { allowWindowUnload, preventWindowUnload } from '@/utils/window'
import { PostContent, SpaceContent } from '@subsocial/api/types'
import {
  CreateSpaceCallParsedArgs,
  socialCallName,
} from '@subsocial/data-hub-sdk'
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { DatahubParams, createSignedSocialDataEvent } from '../utils'

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
    spaceId: string
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
export function useSendMessage(
  config?: UseMutationOptions<void, unknown, Params, unknown>
) {
  const client = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: async (data) => {
      const content = {
        body: data.message,
        inReplyTo: ReplyWrapper(data.replyTo),
        extensions: data.extensions,
      } as PostContent

      const maxLength = getMaxMessageLength(data.chatId)
      if (data.message && data.message.length > maxLength)
        throw new Error(
          'Your message is too long, please split it up to multiple messages'
        )

      await createSpaceData({
        ...getCurrentWallet(),
        uuid: data.uuid,
        timestamp: data.timestamp,
        isOffchain: true,
        args: {
          parentPostId: ParentPostIdWrapper(data.replyTo),
          content: content,
          rootPostId: data.chatId,
          spaceId: data.hubId,
        },
      })
    },
    onMutate: async (data) => {
      config?.onMutate?.(data)
      preventWindowUnload()
      const content = {
        body: data.message,
        inReplyTo: ReplyWrapper(data.replyTo),
        extensions: data.extensions,
      } as PostContent

      const newId = getDeterministicId({
        account:
          getCurrentWallet().proxyToAddress || getCurrentWallet().address,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })

      addOptimisticData({
        address:
          getCurrentWallet().proxyToAddress || getCurrentWallet().address,
        params: data,
        ipfsContent: content,
        client,
        customId: newId,
      })
      config?.onMutate?.(data)
    },
    onError: (err, data, context) => {
      config?.onError?.(err, data, context)
      allowWindowUnload()
      const newId = getDeterministicId({
        account:
          getCurrentWallet().proxyToAddress || getCurrentWallet().address,
        timestamp: data.timestamp.toString(),
        uuid: data.uuid,
      })
      const { chatId } = data
      deleteOptimisticData({
        chatId,
        client,
        idToDelete: newId,
      })
      config?.onError?.(err, data, context)
    },
    onSuccess: (...params) => {
      config?.onSuccess?.(...params)
      allowWindowUnload()
    },
  })
}
