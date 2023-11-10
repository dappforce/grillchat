import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  CreatePostOptimisticInput,
  UpdatePostBlockchainSyncStatusInput,
  UpdatePostOptimisticInput,
} from '@/server/datahub/generated-mutation'
import {
  createPostData,
  notifyCreatePostFailedOrRetryStatus,
  notifyUpdatePostFailedOrRetryStatus,
  updatePostData,
} from '@/server/datahub/post'
import {
  CreateChatPermissionDeniedError,
  CreateMessagePermissionDeniedError,
  datahubMutationWrapper,
  RateLimitError,
} from '@/server/datahub/utils'
import { z } from 'zod'

export type DatahubMutationInput =
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
export type ApiDatahubResponse = ApiResponse

export default handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})<ApiDatahubResponse>({
  allowedMethods: ['POST'],
  errorLabel: 'datahub-mutation',
  handler: async (data: DatahubMutationInput, _, res) => {
    const mapper = datahubMutationWrapper(datahubActionMapping)
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

function datahubActionMapping(data: DatahubMutationInput) {
  switch (data.action) {
    case 'create-post':
      return createPostData(data.payload)
    case 'update-post':
      return updatePostData(data.payload)
    case 'notify-create-failed':
      return notifyCreatePostFailedOrRetryStatus(data.payload)
    case 'notify-update-failed':
      return notifyUpdatePostFailedOrRetryStatus(data.payload)
  }
}
