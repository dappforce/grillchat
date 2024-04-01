import { handlerWrapper } from '@/server/common'
import { subsquareApi } from '@/server/opengov/utils'
import { toSubsocialAddress } from '@subsocial/utils'
import { z } from 'zod'

const handler = handlerWrapper({
  inputSchema: z.object({
    id: z.number().int().positive(),
  }),
  dataGetter: (req) => req.query,
})<ApiProposalsResponse>({
  errorLabel: 'proposal-detail',
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const response = await getProposalDetailServer(data)
    res.json({ ...response, message: 'OK', success: true })
  },
})
export default handler

export type ProposalDetail = {
  id: number
  beneficiary: string
  proposer: string
  title: string
  content: string
  status: string
  requested: string
  type: string
  track: number
  vote: {
    total: string
    ayes: string
    nays: string
  }
}
export type ApiProposalsResponse = { data: ProposalDetail }

type ApiProposal = {
  title: string
  referendumIndex: number
  proposer: string
  track: number
  content: string
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
export async function getProposalDetailServer({
  id,
}: {
  id: number
}): Promise<ApiProposalsResponse> {
  const res = await subsquareApi.get(`/gov2/referendums/${id}`)
  const post = res.data as ApiProposal

  return {
    data: {
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
      content: post.content,
    },
  }
}
