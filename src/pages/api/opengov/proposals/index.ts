import { redisCallWrapper } from '@/server/cache'
import { handlerWrapper } from '@/server/common'
import {
  Proposal,
  SubsquareProposal,
  mapSubsquareProposalToProposal,
} from '@/server/opengov/mapper'
import { subsquareApi } from '@/server/opengov/utils'
import { z } from 'zod'

const handler = handlerWrapper({
  inputSchema: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  }),
  dataGetter: (req) => req.query,
})<ApiProposalsResponse>({
  errorLabel: 'proposals',
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const response = await getProposalsServer(data)
    res.json({ ...response, message: 'OK', success: true })
  },
})
export default handler

export type ApiProposalsResponse = {
  data: Proposal[]
  page: number
  hasMore: boolean
  totalData: number
}

const PROPOSALS_MAX_AGE = 5 * 60 // 5 minutes
const getProposalsRedisKey = (page: number, limit: number) =>
  'proposals:' + page + ':' + limit
export async function getProposalsServer({
  page = 1,
  limit = 10,
}: {
  page: number
  limit: number
}): Promise<ApiProposalsResponse> {
  let resData: { total: number; items: SubsquareProposal[] }
  const cachedData = await redisCallWrapper(async (redis) => {
    const data = await redis?.get(getProposalsRedisKey(page, limit))
    return data
      ? (JSON.parse(data) as {
          total: number
          items: SubsquareProposal[]
        })
      : null
  })
  if (cachedData) {
    resData = cachedData
  } else {
    const res = await subsquareApi.get('/gov2/referendums', {
      params: {
        page,
        pageSize: limit,
      },
    })
    resData = res.data as { total: number; items: SubsquareProposal[] }
    await redisCallWrapper(async (redis) => {
      return redis?.set(
        getProposalsRedisKey(page, limit),
        JSON.stringify(resData),
        'EX',
        PROPOSALS_MAX_AGE
      )
    })
  }

  const hasMore = page * limit < resData.total
  const mappedData = await Promise.all(
    resData.items.map((val) => mapSubsquareProposalToProposal(val))
  )
  return {
    data: mappedData,
    page,
    hasMore,
    totalData: resData.total,
  }
}
