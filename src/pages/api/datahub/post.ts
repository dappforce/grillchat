import { ApiResponse, handlerWrapper } from '@/old/server/common'
import {
  CanUserDoAction,
  CreatePostOptimisticInput,
  UpdatePostBlockchainSyncStatusInput,
  UpdatePostOptimisticInput,
} from '@/old/server/datahub-queue/generated'
import {
  createPostData,
  getCanAccountDo,
  notifyCreatePostFailedOrRetryStatus,
  notifyUpdatePostFailedOrRetryStatus,
  updatePostData,
} from '@/old/server/datahub-queue/post'
import {
  CreateChatPermissionDeniedError,
  CreateMessagePermissionDeniedError,
  RateLimitError,
  datahubMutationWrapper,
} from '@/old/server/datahub-queue/utils'
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
  errorLabel: 'datahub-query',
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
      action: 'notify-create-failed'
      payload: UpdatePostBlockchainSyncStatusInput
    }
  | {
      action: 'notify-update-failed'
      payload: UpdatePostBlockchainSyncStatusInput
    }

export type ApiDatahubPostResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})<ApiDatahubPostResponse>({
  allowedMethods: ['POST'],
  errorLabel: 'datahub-mutation',
  handler: async (data: ApiDatahubPostMutationBody, _, res) => {
    const mapper = datahubMutationWrapper(datahubPostActionMapping)
    try {
      await mapper(data)
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
    res.status(200).json({ message: 'OK', success: true })
  },
})

function datahubPostActionMapping(data: ApiDatahubPostMutationBody) {
  switch (data.action) {
    case 'create-post':
      return createPostData(data.payload)
    case 'update-post':
      return updatePostData(data.payload)
    case 'notify-create-failed':
      return notifyCreatePostFailedOrRetryStatus(data.payload)
    case 'notify-update-failed':
      return notifyUpdatePostFailedOrRetryStatus(data.payload)
    default:
      throw new Error('Unknown action')
  }
}
