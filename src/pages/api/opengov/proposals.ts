import { handlerWrapper } from '@/server/common'
import { subsquareApi } from '@/server/opengov/utils'
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
    const response = await getProposalsServer(data)
    res.json({ ...response, message: 'OK', success: true })
  },
})
export default handler

export type Proposal = {
  id: number
  beneficiary: string
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

type ApiProposal = {
  title: string
  referendumIndex: number
  proposer: string
  track: number
  state: {
    name: string
  }
  onchainData: {
    info: {
      origin: {
        origins: string
      }
    }
    tally: {
      ayes: string
      nays: string
      support: string
    }
    treasuryInfo?: {
      amount: string
      beneficiary: string
    }
  }
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
  const resData = res.data as { total: number; items: ApiProposal[] }

  const hasMore = page * limit < resData.total
  return {
    data: resData.items.map((post) => ({
      id: post.referendumIndex,
      beneficiary: post.onchainData.treasuryInfo?.beneficiary ?? '',
      proposer: toSubsocialAddress(post.proposer)!,
      requested: BigInt(
        post.onchainData.treasuryInfo?.amount ?? '0'
      ).toString(),
      status: post.state.name,
      title: post.title,
      vote: {
        ayes: BigInt(post.onchainData.tally.ayes ?? '0').toString(),
        nays: BigInt(post.onchainData.tally.nays ?? '0').toString(),
        total: BigInt(post.onchainData.tally.support ?? '0').toString(),
      },
      type: post.onchainData.info.origin.origins,
      track: post.track,
    })),
    page,
    hasMore,
    totalData: resData.total,
  }
}
