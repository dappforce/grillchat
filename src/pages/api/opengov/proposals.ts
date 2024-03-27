import { handlerWrapper } from '@/server/common'
import { polkassemblyApi } from '@/server/opengov/utils'
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
    const response = await getProposals(data)
    res.json({ ...response, message: 'OK', success: true })
  },
})
export default handler

type Proposal = {
  post_id: number
  title: string
}
export type ApiProposalsResponse = {
  data: Proposal[]
  page: number
  hasMore: boolean
  totalData: number
}
const LIMIT_PER_PAGE = 15
// TODO: add redis cache
async function getProposals({
  page = 1,
  limit = 10,
}: {
  page: number
  limit: number
}): Promise<ApiProposalsResponse> {
  const res = await polkassemblyApi.get('/listing/on-chain-posts', {
    params: {
      page,
      listingLimit: limit,
      proposalType: 'referendums_v2',
      trackStatus: 'All',
      sortBy: 'newest',
    },
  })
  const resData = res.data as { count: number; posts: Proposal[] }

  const hasMore = page * LIMIT_PER_PAGE < resData.count
  return {
    data: resData.posts,
    page,
    hasMore,
    totalData: resData.count,
  }
}
