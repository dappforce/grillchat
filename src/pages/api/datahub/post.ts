import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  CanUserDoAction,
  CreatePostOptimisticInput,
  SocialProfileAddReferrerIdInput,
  UpdatePostOptimisticInput,
} from '@/server/datahub-queue/generated'
import {
  approveMessage,
  approveUser,
  createPostData,
  getCanAccountDo,
  updatePostData,
} from '@/server/datahub-queue/post'
import {
  CreateChatPermissionDeniedError,
  CreateMessagePermissionDeniedError,
  RateLimitError,
  datahubMutationWrapper,
} from '@/server/datahub-queue/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST_handler(req, res)
  } else {
    return GET_handler(req, res)
  }
}

type GetResponseRes = { isAllowed: boolean }
export type ApiDatahubPostGetResponse = ApiResponse<GetResponseRes>

const querySchema = z.object({
  address: z.string(),
  rootPostId: z.string(),
})
export type DatahubPostQueryInput = z.infer<typeof querySchema>
const GET_handler = handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req) => req.query,
})<GetResponseRes>({
  allowedMethods: ['GET'],
  errorLabel: 'datahub-post',
  handler: async (data, _, res) => {
    const canUserDo = await getCanAccountDo({
      action: CanUserDoAction.CreateComment,
      address: data.address,
      rootPostId: data.rootPostId,
    })
    res.json({ isAllowed: canUserDo, message: 'OK', success: true })
  },
})

export type ApiDatahubPostMutationBody =
  | {
      action: 'create-post'
      payload: CreatePostOptimisticInput
    }
  | {
      action: 'update-post'
      payload: UpdatePostOptimisticInput
    }
  | {
      action: 'approve-user'
      payload: SocialProfileAddReferrerIdInput
    }
  | {
      action: 'approve-message'
      payload: SocialProfileAddReferrerIdInput
    }

export type ApiDatahubPostResponse = ApiResponse<{ callId?: string }>
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})<ApiDatahubPostResponse>({
  allowedMethods: ['POST'],
  errorLabel: 'datahub-mutation',
  handler: async (data: ApiDatahubPostMutationBody, _, res) => {
    const mapper = datahubMutationWrapper(datahubPostActionMapping)
    try {
      const callId = await mapper(data)
      res.status(200).json({ message: 'OK', success: true, callId })
    } catch (err) {
      if (err instanceof RateLimitError) {
        return res.status(429).send({
          success: false,
          message: err.message,
          errors: err,
        } as ApiResponse)
      }
      if (
        err instanceof CreateChatPermissionDeniedError ||
        err instanceof CreateMessagePermissionDeniedError
      ) {
        return res.status(401).send({
          success: false,
          message: err.message,
          errors: err,
        } as ApiResponse)
      }
      throw err
    }
  },
})

function datahubPostActionMapping(data: ApiDatahubPostMutationBody) {
  switch (data.action) {
    case 'create-post':
      return createPostData(data.payload)
    case 'update-post':
      return updatePostData(data.payload)
    case 'approve-user':
      return approveUser(data.payload)
    case 'approve-message':
      return approveMessage(data.payload)
    default:
      throw new Error('Unknown action')
  }
}
