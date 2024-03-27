import { handlerWrapper } from '@/server/common'
import { polkassemblyApi } from '@/server/opengov/utils'
import { toSubsocialAddress } from '@subsocial/utils'
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

export type Proposal = {
  id: string
  beneficiaries: string[]
  proposer: string
  title: string
  status: string
  requested: string
  vote: {
    total: string
    ayes: string
    nays: string
  }
}
export type ApiProposalsResponse = {
  data: Proposal[]
  page: number
  hasMore: boolean
  totalData: number
}

type PolkassemblyProposal = {
  beneficiaries: { value: string }[]
  created_at: string
  post_id: number
  proposer: string
  requestedAmount: string
  status: string
  title: string
  tally: {
    ayes: string
    nays: string
    support: string
  }
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
  const resData = res.data as { count: number; posts: PolkassemblyProposal[] }

  const hasMore = page * LIMIT_PER_PAGE < resData.count
  return {
    data: resData.posts.map((post) => ({
      id: post.post_id.toString(),
      beneficiaries: post.beneficiaries.map(
        (b) => toSubsocialAddress(b.value)!
      ),
      proposer: toSubsocialAddress(post.proposer)!,
      requested: BigInt(post.requestedAmount ?? '0').toString(),
      status: post.status,
      title: post.title,
      vote: {
        ayes: BigInt(post.tally.ayes ?? '0').toString(),
        nays: BigInt(post.tally.nays ?? '0').toString(),
        total: BigInt(post.tally.support ?? '0').toString(),
      },
    })),
    page,
    hasMore,
    totalData: resData.count,
  }
}
