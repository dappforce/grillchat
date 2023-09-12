import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { generateGetDataFromSquidWithBlockchainFallback } from '@/server/squid'
import {
  getProfilesFromSubsocial,
  SubsocialProfile,
} from '@/services/subsocial/profiles/fetcher'
import { toSubsocialAddress } from '@subsocial/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  addresses: z.array(z.string()).or(z.string()),
})
export type ApiProfilesParams = z.infer<typeof querySchema>

const bodySchema = z.object({
  address: z.string(),
})
export type ApiProfilesInvalidationBody = z.infer<typeof bodySchema>

type ResponseData = {
  data?: SubsocialProfile[]
}
export type ApiProfilesResponse = ApiResponse<ResponseData>
export type ApiProfilesInvalidationResponse = ApiResponse<{}>

const INVALIDATED_MAX_AGE = 1 * 60 // 1 minute
const getInvalidatedProfileRedisKey = (id: string) => {
  return `profiles-invalidated:${id}`
}

const GET_handler = handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const addresses = Array.isArray(data.addresses)
      ? data.addresses
      : [data.addresses]
    const profiles = await getProfilesServer(addresses)
    return res
      .status(200)
      .send({ success: true, message: 'OK', data: profiles })
  },
})

const POST_handler = handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<{}>({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    redisCallWrapper(async (redis) => {
      return redis?.set(
        getInvalidatedProfileRedisKey(data.address),
        data.address,
        'EX',
        INVALIDATED_MAX_AGE
      )
    })

    return res.status(200).send({ success: true, message: 'OK' })
  },
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  } else if (req.method === 'POST') {
    return POST_handler(req, res)
  }
}

export const getProfilesServer = generateGetDataFromSquidWithBlockchainFallback(
  getProfilesFromSubsocial,
  { paramToId: (param) => param, responseToId: (response) => response.address },
  {
    blockchainResponse: (data) => {
      data.address = toSubsocialAddress(data.address)!
    },
  },
  getInvalidatedProfileRedisKey
)
