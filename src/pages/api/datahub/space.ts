import { ApiResponse, handlerWrapper } from '@/server/common'
import { CreateMutateSpaceOffChainDataInput } from '@/server/datahub-queue/generated'
import {
  createSpaceServer,
  updateSpaceServer,
} from '@/server/datahub-queue/space'
import {
  CreateChatPermissionDeniedError,
  CreateMessagePermissionDeniedError,
  RateLimitError,
  datahubMutationWrapper,
} from '@/server/datahub-queue/utils'
import { z } from 'zod'

export type ApiDatahubSpaceMutationBody =
  | {
      action: 'create-space'
      payload: CreateMutateSpaceOffChainDataInput
    }
  | {
      action: 'update-space'
      payload: CreateMutateSpaceOffChainDataInput
    }
  | {
      action: 'create-profile'
      payload: CreateMutateSpaceOffChainDataInput
    }

export type ApiDatahubSpaceResponse = ApiResponse
export default handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.body,
})<ApiDatahubSpaceResponse>({
  allowedMethods: ['POST'],
  errorLabel: 'datahub-mutation',
  handler: async (data: ApiDatahubSpaceMutationBody, _, res) => {
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

function datahubPostActionMapping(data: ApiDatahubSpaceMutationBody) {
  switch (data.action) {
    case 'create-space':
      return createSpaceServer(data.payload)
    case 'update-space':
      return updateSpaceServer(data.payload)
    // TODO: implement create profile
    default:
      throw new Error('Unknown action')
  }
}
