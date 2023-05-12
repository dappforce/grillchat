import { WalletClient } from '@/services/api/utils'
import { getTxSubDispatchErrorMessage } from '@/services/api/utils/extrinsic'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { getCrustIpfsAuth, getIpfsPinUrl } from '@/utils/env/server'
import { ApiPromise } from '@polkadot/api'
import { SubsocialIpfsApi } from '@subsocial/api'
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
  cid?: string
}

export const CRUST_IPFS_CONFIG = {
  ipfsNodeUrl: 'https://gw-seattle.crustcloud.io',
  ipfsClusterUrl: getIpfsPinUrl(),
}

const headers = { authorization: `Bearer ${getCrustIpfsAuth()}` }

const ipfs = new SubsocialIpfsApi({
  ...CRUST_IPFS_CONFIG,
  headers,
})
ipfs.setWriteHeaders(headers)
ipfs.setPinHeaders(headers)

export async function saveDiscussionContent(
  contentBody: IpfsPostContent
): Promise<SaveDiscussionContentResponse> {
  let cid: string
  try {
    cid = await ipfs.saveJson(contentBody)
    ipfs.pinContent(cid, { 'meta.gatewayId': 1 }).then()
    return {
      success: true,
      cid,
    }
  } catch (e: unknown) {
    return {
      success: false,
      errors: e
        ? { message: 'Error has been occurred in ipfs', ...e }.message
        : '',
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
    const eventsUnsub = await api.query.system.events((events) => {
      events.forEach((record) => {
        const { event, phase } = record

        try {
          if (
            phase.isApplyExtrinsic &&
            event.section === 'resource-commenting' &&
            event.method === 'ResourceDiscussionLinked'
          ) {
            const parsedData = event.data.toJSON() as {
              resource_id: string
              account_id: string
              post_id: string
            }

            if (parsedData && resourceId === parsedData.resource_id) {
              resolve({
                success: true,
                data: {
                  postId: parsedData.post_id,
                },
              })
              eventsUnsub()
            }
          }
        } catch (e) {
          resolve({
            success: false,
            message: e
              ? { message: 'Error has been occurred in ipfs', ...e }.message
              : '',
            errors: [e],
          })
        }
      })
    })

    const unsub = await api.tx.resourceDiscussion
      .create_resource_discussion(resourceId, spaceId, contentCid)
      .signAndSend(
        WalletClient.getInstance().account.discussionCreator.address,
        async (resp: any) => {
          const { status, txHash, txIndex, dispatchError, isCompleted } = resp

          if (dispatchError) {
            resolve({
              success: false,
              message: getTxSubDispatchErrorMessage(dispatchError, api),
            })
            unsub()
            return
          }

          if (status.isInBlock) {
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

export async function getOrCreateDiscussion({
  resourceId,
  spaceId,
  content,
}: DiscussionInput): Promise<ApiDiscussionResponse | never> {
  let existingDiscussionId: string | null = null
  try {
    const subsocialApi = await (await getSubsocialApi()).substrateApi
    existingDiscussionId = (await subsocialApi.query.timestamp.now()).toString() // Change to call to pallet resource-commenting

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
      message: e
        ? { message: 'Error has been occurred in ipfs', ...e }.message
        : '',
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

  await WalletClient.getInstance().init()

  const { resourceId, spaceId, content } = body.data

  const response: ApiDiscussionResponse = await getOrCreateDiscussion({
    content: {
      title: content.title,
      body: content.body,
      image: content.image,
      tags: [],
      canonical: '', // TODO must be reviewed
    },
    spaceId,
    resourceId,
  })

  res.status(response.success ? 200 : 500).send(response)
}
