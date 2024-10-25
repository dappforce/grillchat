import { getTxSubDispatchErrorMessage } from '@/old/server/blockchain'
import { redisCallWrapper } from '@/old/server/cache'
import {
  ApiResponse,
  getCommonErrorMessage,
  handlerWrapper,
} from '@/old/server/common'
import { getIpfsApi } from '@/old/server/ipfs'
import { WalletManager } from '@/old/server/wallet-client'
import { getSubsocialApi } from '@/old/subsocial-query/subsocial/connection'
import { IpfsWrapper } from '@/utils/ipfs'
import { wait } from '@/utils/promise'
import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { stringToHex } from '@polkadot/util'
import { asAccountId } from '@subsocial/api'
import { IpfsPostContent } from '@subsocial/api/types'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const bodySchema = z.object({
  resourceId: z.string(),
  spaceId: z.string(),
  content: z.object({
    title: z.string(),
    body: z.string().optional(),
    image: z.string().optional(),
  }),
})
export type ApiDiscussionInput = z.infer<typeof bodySchema>

type DiscussionDataResponse = {
  data?: { postId: string }
}
export type ApiDiscussionResponse = ApiResponse<DiscussionDataResponse>

export type SaveDiscussionContentResponse = {
  success: boolean
  errors?: any
  message?: string
  cid?: string
}

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<DiscussionDataResponse>({
  errorLabel: 'discussion',
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    const { resourceId, spaceId, content } = data

    const response: ApiDiscussionResponse = await getOrCreateDiscussion({
      content: {
        title: content.title,
        body: content.body,
        image: content.image,
      },
      spaceId,
      resourceId,
    })

    return res.status(response.success ? 200 : 500).send(response)
  },
})

export async function saveDiscussionContent(
  contentBody: IpfsPostContent
): Promise<SaveDiscussionContentResponse> {
  let cid: string
  const { saveAndPinJson } = getIpfsApi()

  try {
    cid = await saveAndPinJson(contentBody)
    return {
      success: true,
      cid,
    }
  } catch (e: any) {
    return {
      success: false,
      message: getCommonErrorMessage(e),
      errors: [e],
    }
  }
}

async function createDiscussionAndGetPostId({
  resourceId,
  spaceId,
  contentCid,
  api,
}: {
  resourceId: string
  spaceId: string
  contentCid: string
  api: ApiPromise
}): Promise<ApiDiscussionResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const unsub = await api.tx.resourceDiscussions
        .createResourceDiscussion(resourceId, spaceId, IpfsWrapper(contentCid))
        .signAndSend(
          (
            await WalletManager.getInstance()
          ).account.discussionCreator,
          async (resp: SubmittableResult) => {
            const { status, events, dispatchError, isCompleted } = resp

            if (dispatchError) {
              resolve({
                success: false,
                message: getTxSubDispatchErrorMessage(dispatchError, api),
              })
              unsub()
              return
            }

            if (status.isFinalized || status.isInBlock) {
              for (const { event, phase } of events) {
                try {
                  if (
                    phase.isApplyExtrinsic &&
                    event.section === 'resourceDiscussions' &&
                    event.method === 'ResourceDiscussionLinked'
                  ) {
                    const [resourceIdHex, , postId] = event.data.toJSON() as [
                      string,
                      string,
                      number
                    ]

                    if (stringToHex(resourceId) === resourceIdHex) {
                      const id = postId.toString()
                      await redisCallWrapper((redis) =>
                        redis?.set(
                          getDiscussionRedisKey(resourceId),
                          id,
                          'EX',
                          MAX_AGE
                        )
                      )
                      resolve({
                        message: 'OK',
                        success: true,
                        data: {
                          postId: id,
                        },
                      })
                      unsub()
                    }
                  }
                } catch (e) {
                  resolve({
                    success: false,
                    message: getCommonErrorMessage(e),
                    errors: [e],
                  })
                }
              }

              unsub()
              return
            } else {
              console.error(`Status of sending: ${status.type}`)
            }

            if (isCompleted) {
              unsub()
            }
          }
        )
    } catch (err) {
      reject(err)
    }
  })
}

const MAX_AGE = 24 * 60 * 60 // 24 hour
const getDiscussionRedisKey = (id: string) => {
  return `discussion:${id}`
}
export async function getDiscussion(resourceId: string) {
  const cachedData = await redisCallWrapper((redis) => {
    return redis?.get(getDiscussionRedisKey(resourceId))
  })
  if (typeof cachedData === 'string') return cachedData

  try {
    const subsocialApi = await (await getSubsocialApi()).substrateApi
    const existingDiscussionId = (
      await subsocialApi.query.resourceDiscussions.resourceDiscussion(
        resourceId,
        asAccountId(
          (
            await WalletManager.getInstance()
          ).account.discussionCreator.address
        )
      )
    ).toString()

    await redisCallWrapper((redis) =>
      redis?.set(
        getDiscussionRedisKey(resourceId),
        existingDiscussionId,
        'EX',
        MAX_AGE
      )
    )

    return existingDiscussionId
  } catch (err) {
    return null
  }
}

const MUTATION_MAX_AGE = 18 // 18 secs
const getDiscussionMutationKey = (id: string) => {
  return `discussion-mutation:${id}`
}
export async function getOrCreateDiscussion(
  data: ApiDiscussionInput
): Promise<ApiDiscussionResponse> {
  const { resourceId, spaceId, content } = data
  let existingDiscussionId: string | null = null
  try {
    existingDiscussionId = await getDiscussion(resourceId)
    const subsocialApi = await (await getSubsocialApi()).substrateApi

    if (existingDiscussionId)
      return {
        message: 'OK',
        success: true,
        data: {
          postId: existingDiscussionId,
        },
      }

    const isCreatingInAnotherSession = await redisCallWrapper((redis) => {
      return redis?.get(getDiscussionMutationKey(resourceId)) as Promise<string>
    })
    if (isCreatingInAnotherSession) {
      await wait(20 * 1000)
      return getOrCreateDiscussion(data)
    }
    redisCallWrapper((redis) =>
      redis?.set(
        getDiscussionRedisKey(resourceId),
        'true',
        'EX',
        MUTATION_MAX_AGE
      )
    )
    const contentCid = await saveDiscussionContent(content as IpfsPostContent)

    if (!contentCid.success && !contentCid.cid) {
      throw new Error('Failed to save content to IPFS')
    }

    const res = await createDiscussionAndGetPostId({
      resourceId,
      spaceId,
      contentCid: contentCid.cid!,
      api: subsocialApi,
    })
    await redisCallWrapper((redis) =>
      redis?.del(getDiscussionRedisKey(resourceId))
    )
    return res
  } catch (e) {
    return {
      success: false,
      message: getCommonErrorMessage(e),
      errors: [e],
    }
  }
}
