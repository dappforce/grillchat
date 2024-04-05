import { handlerWrapper } from '@/server/common'
import {
  Proposal,
  SubsquareProposal,
  mapSubsquareProposalToProposal,
} from '@/server/opengov/mapper'
import { subsquareApi } from '@/server/opengov/utils'
import BigNumber from 'bignumber.js'
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

export type ApiProposalsResponse = { data: Proposal }

// TODO: add redis cache
type SubsquareVote = {
  account: string
  ayeBalance: string
  ayeVotes: string
  nayBalance: string
  nayVotes: string
  abstainBalance: string
  abstainVotes: string
  isSplit: boolean
  isSplitAbstain: boolean
  balance: string
  aye: boolean
  nay: boolean
  isAbstain: boolean
}
export async function getProposalDetailServer({
  id,
}: {
  id: number
}): Promise<ApiProposalsResponse> {
  const [res, votesRes] = await Promise.all([
    subsquareApi.get(`/gov2/referendums/${id}`),
    subsquareApi.get(`/gov2/referenda/${id}/votes`),
  ] as const)
  const proposal = res.data as SubsquareProposal

  const votesData = (votesRes.data ?? []) as SubsquareVote[]

  const mapped = await mapSubsquareProposalToProposal(proposal)
  const allVotes = votesData
    .reduce((result, vote) => {
      if (vote.isSplit) {
        return [...result, ...extractSplitVotes(vote)]
      } else if (vote.isSplitAbstain) {
        return [...result, ...extractSplitAbstainVotes(vote)]
      }
      return [...result, vote]
    }, [] as Partial<SubsquareVote>[])
    .filter((v) => new BigNumber(v.balance ?? '0').gt(0))

  const ayesCount = allVotes.filter((v) => v.aye).length
  const naysCount = allVotes.filter((v) => !v.aye && !v.isAbstain).length

  return {
    data: { ...mapped, tally: { ...mapped.tally, ayesCount, naysCount } },
  }
}

function extractSplitVotes(vote: SubsquareVote) {
  const { account, ayeBalance, ayeVotes, nayBalance, nayVotes } = vote
  const common = {
    account,
    isDelegating: false,
    isSplit: true,
    conviction: 0,
  }
  return [
    {
      ...common,
      balance: ayeBalance,
      aye: true,
      votes: ayeVotes,
    },
    {
      ...common,
      balance: nayBalance,
      aye: false,
      votes: nayVotes,
    },
  ]
}

function extractSplitAbstainVotes(vote: SubsquareVote) {
  const {
    account,
    ayeBalance,
    ayeVotes,
    nayBalance,
    nayVotes,
    abstainBalance,
    abstainVotes,
  } = vote
  const common = {
    account,
    isDelegating: false,
    isSplitAbstain: true,
  }

  return [
    {
      ...common,
      balance: abstainBalance,
      isAbstain: true,
      conviction: 0,
      votes: abstainVotes,
    },
    {
      ...common,
      balance: ayeBalance,
      aye: true,
      conviction: 0,
      votes: ayeVotes,
    },
    {
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
      votes: nayVotes,
    },
  ]
}
