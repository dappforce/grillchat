import { getTxSubDispatchErrorMessage } from '@/server/blockchain'
import {
  ApiResponse,
  getCommonErrorMessage,
  handlerWrapper,
} from '@/server/common'
import { getIpfsApi } from '@/server/ipfs'
import { WalletManager } from '@/server/wallet-client'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { IpfsWrapper } from '@/utils/ipfs'
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
    body: z.string(),
    image: z.string(),
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
  allowedMethods: ['POST'],
  handler: async (data, req, res) => {
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
  return new Promise(async (resolve) => {
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
                    resolve({
                      message: 'OK',
                      success: true,
                      data: {
                        postId: postId.toString(),
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
            console.log(`Status of sending: ${status.type}`)
          }

          if (isCompleted) {
            unsub()
          }
        }
      )
  })
}

export async function getDiscussion(resourceId: string) {
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

    return existingDiscussionId
  } catch (err) {
    return null
  }
}

export async function getOrCreateDiscussion({
  resourceId,
  spaceId,
  content,
}: ApiDiscussionInput): Promise<ApiDiscussionResponse> {
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
    const contentCid = await saveDiscussionContent(content as IpfsPostContent)

    if (!contentCid.success && !contentCid.cid) {
      throw new Error()
    }

    return createDiscussionAndGetPostId({
      resourceId,
      spaceId,
      contentCid: contentCid.cid!,
      api: subsocialApi,
    })
  } catch (e) {
    return {
      success: false,
      message: getCommonErrorMessage(e),
      errors: [e],
    }
  }
}
