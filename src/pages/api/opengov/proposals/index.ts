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

// TODO: add redis cache
export async function getProposalsServer({
  page = 1,
  limit = 10,
}: {
  page: number
  limit: number
}): Promise<ApiProposalsResponse> {
  const res = await subsquareApi.get('/gov2/referendums', {
    params: {
      page,
      pageSize: limit,
    },
  })
  const resData = res.data as { total: number; items: SubsquareProposal[] }

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
