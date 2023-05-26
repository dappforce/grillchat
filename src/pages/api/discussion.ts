import {
  getCommonErrorMessage,
  getTxSubDispatchErrorMessage,
  WalletManager,
} from '@/services/api/utils'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { IpfsWrapper } from '@/utils/ipfs'
import { getIpfsApi } from '@/utils/server'
import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { stringToHex } from '@polkadot/util'
import { asAccountId } from '@subsocial/api'
import { IpfsPostContent } from '@subsocial/api/types'
import { NextApiRequest, NextApiResponse } from 'next'
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

export type DiscussionInput = {
  resourceId: string
  spaceId: string
  content: IpfsPostContent
}

export type DiscussionDataResponse = {
  postId: string
}
export type ApiPostsParams = z.infer<typeof bodySchema>
export type ApiDiscussionResponse = {
  success: boolean
  errors?: any
  message?: string
  data?: DiscussionDataResponse
  hash?: string
}

export type SaveDiscussionContentResponse = {
  success: boolean
  errors?: any
  message?: string
  cid?: string
}

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
    return ''
  }
}

export async function getOrCreateDiscussion({
  resourceId,
  spaceId,
  content,
}: DiscussionInput): Promise<ApiDiscussionResponse> {
  let existingDiscussionId: string | null = null
  try {
    existingDiscussionId = await getDiscussion(resourceId)
    const subsocialApi = await (await getSubsocialApi()).substrateApi

    if (existingDiscussionId)
      return {
        success: true,
        data: {
          postId: existingDiscussionId,
        },
      }
    const contentCid = await saveDiscussionContent(content)

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiDiscussionResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = bodySchema.safeParse(req.body)

  if (!body.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: body.error.errors,
    })
  }

  const { resourceId, spaceId, content } = body.data

  const response: ApiDiscussionResponse = await getOrCreateDiscussion({
    content: {
      title: content.title,
      body: content.body,
      image: content.image ?? '',
      tags: [],
      canonical: '',
    },
    spaceId,
    resourceId,
  })

  return res.status(response.success ? 200 : 500).send(response)
}
