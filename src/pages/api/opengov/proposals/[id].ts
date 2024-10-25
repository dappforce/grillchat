import { redisCallWrapper } from '@/old/server/cache'
import { handlerWrapper } from '@/old/server/common'
import {
  PolkassemblyComment,
  Proposal,
  SubsquareComment,
  SubsquareProposal,
  mapSubsquareProposalToProposal,
} from '@/old/server/opengov/mapper'
import { subsquareApi } from '@/old/server/opengov/utils'
import BigNumber from 'bignumber.js'
import { z } from 'zod'

const handler = handlerWrapper({
  inputSchema: z.object({
    id: z.coerce.number().int().positive(),
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
const PROPOSAL_DETAIL_MAX_AGE = 5 * 60 // 5 minutes
const getProposalDetailRedisKey = (id: string) => 'proposal-detail:' + id
export async function getProposalDetailServer({
  id,
}: {
  id: number
}): Promise<ApiProposalsResponse> {
  let proposal: SubsquareProposal
  let votesData: SubsquareVote[]
  let polkassemblyComments: PolkassemblyComment[]
  let subsquareComments: SubsquareComment[]

  const cachedData = await redisCallWrapper(async (redis) => {
    const data = await redis?.get(getProposalDetailRedisKey(id.toString()))
    return data
      ? (JSON.parse(data) as {
          proposal: SubsquareProposal
          votesData: SubsquareVote[]
          polkassemblyComments: PolkassemblyComment[]
          subsquareComments: SubsquareComment[]
        })
      : null
  })
  if (cachedData) {
    proposal = cachedData.proposal
    votesData = cachedData.votesData
    polkassemblyComments = cachedData.polkassemblyComments
    subsquareComments = cachedData.subsquareComments
  } else {
    const [res, votesRes, polkassemblyCommentsRes, subsquareCommentsRes] =
      await Promise.all([
        subsquareApi.get(`/gov2/referendums/${id}`),
        subsquareApi.get(`/gov2/referenda/${id}/votes`),
        subsquareApi.get(
          `/polkassembly-comments?post_id=${id}&post_type=ReferendumV2`
        ),
        subsquareApi.get(`/gov2/referendums/${id}/comments`),
      ] as const)
    proposal = res.data as SubsquareProposal
    votesData = (votesRes.data ?? []) as SubsquareVote[]
    polkassemblyComments = (polkassemblyCommentsRes.data.comments ??
      []) as PolkassemblyComment[]
    subsquareComments = (subsquareCommentsRes.data.items ??
      []) as SubsquareComment[]

    await redisCallWrapper(async (redis) => {
      return redis?.set(
        getProposalDetailRedisKey(id.toString()),
        JSON.stringify({ proposal, votesData, polkassemblyComments }),
        'EX',
        PROPOSAL_DETAIL_MAX_AGE
      )
    })
  }

  const mapped = await mapSubsquareProposalToProposal(proposal, {
    polkassembly: polkassemblyComments,
    subsquare: subsquareComments,
  })
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
