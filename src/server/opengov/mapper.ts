import ProposalStatus from '@/components/opengov/ProposalStatus'
import { getProposalResourceId } from '@/modules/opengov/ProposalDetailPage/context'
import { getDiscussion } from '@/pages/api/discussion'
import { toSubsocialAddress } from '@subsocial/utils'
import { POLKADOT_BLOCK_TIME, getProposalPeriods } from './data'

export type ProposalStatus =
  | 'Submitted'
  | 'Preparing'
  | 'Queueing'
  | 'Confirmed'
  | 'Deciding'
  | 'Confirming'
  | 'Approved'
  | 'Cancelled'
  | 'Killed'
  | 'TimedOut'
  | 'Timeout'
  | 'Rejected'
  | 'Executed'

export type CurveType =
  | {
      linearDecreasing: {
        length: number
        floor: number
        ceil: number
      }
    }
  | {
      reciprocal: {
        factor: number
        xOffset: number
        yOffset: number
      }
    }

export type CommentSource = 'polkassembly' | 'subsquare'
type PolkassemblyCommentWithoutReplies = {
  comment_source: CommentSource
  id: string
  post_index: number
  username: string
  content: string
  created_at: string
  proposer: string
  profile: {
    image: string
  }
}
export type PolkassemblyComment = PolkassemblyCommentWithoutReplies & {
  replies: PolkassemblyCommentWithoutReplies[] | null
}

export type SubsquareComment = {
  _id: string
  content: string
  author: {
    address: '16aaWd4vq3qyrrQKRXDs6VueMrJttjGg8wfs2wmWFKshc5BM'
  }
  height: 1
  createdAt: '2024-03-21T17:41:43.801Z'
  updatedAt: '2024-03-21T17:41:43.801Z'
  replies: SubsquareComment[]
}
export type SubsquareProposal = {
  title: string
  indexer: {
    blockHeight: number
    blockTime: number
  }
  referendumIndex: number
  proposer: string
  track: number
  content: string
  state: {
    name: ProposalStatus
  }
  onchainData: {
    trackInfo?: {
      id: number
      confirmPeriod: number
      decisionDeposit: string
      decisionPeriod: number
      maxDeciding: number
      minApproval: CurveType
      minSupport: CurveType
      minEnactmentPeriod: number
      name: string
      preparePeriod: number
    }
    info: {
      origin: {
        origins: string
      }
      deciding: {
        since: number
        confirming: number
      }
      submissionDeposit: {
        who: string
        amount: number
      }
      decisionDeposit: {
        who: string
        amount: number
      }
    }
    tally: {
      ayes: string
      nays: string
      support: string
      electorate: string
    }
    proposalHash: string
    treasuryInfo?: {
      amount: string
      beneficiary: string
    }
    timeline?: {
      indexer: { blockTime: number; blockHeight: number }
      name: string
    }[]
  }
}

export type ProposalDecisionPeriod =
  | {
      duration: number
      timeLeft: number
    }
  | {
      startTime: number
      endTime: number
      duration: number
      timeLeft: number
      startBlock: number
    }
export type ProposalConfirmationPeriod =
  | {
      duration: number
    }
  | {
      startTime: number
      endTime: number
      duration: number
      attempt: number
      timeLeft: number
      startBlock: number
    }

type BlockTime = {
  block: number
  time: number
}
export type ProposalComment = {
  id: string
  username: string
  content: string
  source: CommentSource
  createdAt: string
  ownerId: string
  redirectLink: string
  profile: {
    image: string
  } | null
  parentComment: ProposalComment | null
}
export type Proposal = {
  id: number
  chatId: string | null
  beneficiary: string
  proposer: string
  title: string
  content: string
  requested: string
  type: string
  track: number
  tally: {
    support: string
    ayes: string
    nays: string
    electorate: string
    ayesCount?: number
    naysCount?: number
  }
  finished: BlockTime | null
  status: ProposalStatus
  latestBlock: number

  decision: ProposalDecisionPeriod | null
  confirmation: ProposalConfirmationPeriod | null
  trackInfo: SubsquareProposal['onchainData']['trackInfo'] | null
  metadata: {
    submissionDeposit: {
      who: string
      amount: number
    } | null
    decisionDeposit: {
      who: string
      amount: number
    } | null
    decisionPeriod: BlockTime | null
    confirmingPeriod: BlockTime | null
    enact: { block: number } | null
    hash: string
  }
  comments: ProposalComment[]
}

export async function mapSubsquareProposalToProposal(
  proposal: SubsquareProposal,
  comments?: {
    polkassembly: PolkassemblyComment[]
    subsquare: SubsquareComment[]
  }
): Promise<Proposal> {
  const chatId = await getDiscussion(
    getProposalResourceId(proposal.referendumIndex)
  )
  const decisionDeposit = proposal.onchainData?.info?.decisionDeposit ?? null
  if (decisionDeposit) {
    decisionDeposit.who = toSubsocialAddress(decisionDeposit.who)!
  }

  const submissionDeposit =
    proposal.onchainData?.info?.submissionDeposit ?? null
  if (submissionDeposit) {
    submissionDeposit.who = toSubsocialAddress(submissionDeposit.who)!
  }

  const trackInfo = proposal.onchainData.trackInfo ?? null

  return {
    id: proposal.referendumIndex,
    comments: mapComments(proposal, comments),
    chatId,
    beneficiary: proposal.onchainData.treasuryInfo?.beneficiary ?? '',
    proposer: toSubsocialAddress(proposal.proposer)!,
    requested: BigInt(
      proposal.onchainData.treasuryInfo?.amount ?? '0'
    ).toString(),
    status: proposal.state.name,
    title: proposal.title,
    latestBlock: getEstimatedCurrentHeight(
      proposal.indexer.blockHeight,
      proposal.indexer.blockTime
    ),
    tally: {
      ayes: BigInt(proposal.onchainData.tally.ayes ?? '0').toString(),
      nays: BigInt(proposal.onchainData.tally.nays ?? '0').toString(),
      support: BigInt(proposal.onchainData.tally.support ?? '0').toString(),
      electorate: BigInt(
        proposal.onchainData.tally.electorate ?? '0'
      ).toString(),
    },
    type: proposal.onchainData.info.origin.origins,
    track: proposal.track,
    content: proposal.content,
    trackInfo,
    metadata: {
      decisionDeposit,
      submissionDeposit,
      confirmingPeriod: trackInfo
        ? {
            block: trackInfo.confirmPeriod,
            time: trackInfo.confirmPeriod * POLKADOT_BLOCK_TIME,
          }
        : null,
      decisionPeriod: trackInfo
        ? {
            block: trackInfo.decisionPeriod,
            time: trackInfo.decisionPeriod * POLKADOT_BLOCK_TIME,
          }
        : null,
      enact: trackInfo
        ? {
            block: trackInfo.minEnactmentPeriod,
          }
        : null,
      hash: proposal.onchainData.proposalHash,
    },
    finished: getProposalFinishedPeriod(proposal),
    ...getProposalPeriods(proposal),
  }
}

const finishedStatus = [
  'Approved',
  'Rejected',
  'TimedOut',
  'Cancelled',
  'Killed',
  'Confirmed',
] satisfies ProposalStatus[]
function getProposalFinishedPeriod(
  proposal: SubsquareProposal
): BlockTime | null {
  const timeline = proposal.onchainData.timeline
  if (!timeline) return null
  const finished = timeline.find((t) => finishedStatus.includes(t.name))
  if (!finished) return null
  return {
    block: finished.indexer.blockHeight,
    time: finished.indexer.blockTime,
  }
}

function getEstimatedCurrentHeight(
  indexerHeight: number,
  indexerTimestamp: number
) {
  return (
    indexerHeight +
    Math.floor((Date.now() - indexerTimestamp) / POLKADOT_BLOCK_TIME)
  )
}

function mapComments(
  proposal: SubsquareProposal,
  comments:
    | { polkassembly: PolkassemblyComment[]; subsquare: SubsquareComment[] }
    | undefined
): ProposalComment[] {
  if (!comments) return []

  const flattenedComments: ProposalComment[] = []
  comments.polkassembly.forEach((c) => {
    const mappedComment: ProposalComment = {
      id: c.id,
      username: c.username ?? '',
      content: c.content ?? '',
      source: c.comment_source ?? 'subsquare',
      createdAt: c.created_at ?? '',
      profile: c.profile ?? null,
      ownerId: c.proposer ?? '',
      parentComment: null,
      redirectLink: getPolkassemblyCommentRedirectLink(proposal, c),
    }
    flattenedComments.push(mappedComment)
    if (c.replies) {
      c.replies.forEach((r) => {
        flattenedComments.push({
          id: r.id,
          username: r.username ?? '',
          content: r.content ?? '',
          source: r.comment_source ?? 'subsquare',
          createdAt: r.created_at ?? '',
          profile: r.profile ?? null,
          ownerId: r.proposer ?? '',
          parentComment: mappedComment,
          redirectLink: getPolkassemblyCommentRedirectLink(proposal, r),
        })
      })
    }
  })

  comments.subsquare.forEach((c) => {
    const mappedComment: ProposalComment = {
      id: c._id,
      username: '',
      content: c.content ?? '',
      source: 'subsquare',
      createdAt: c.createdAt ?? '',
      profile: null,
      ownerId: c.author.address ?? '',
      parentComment: null,
      redirectLink: `https://polkadot.subsquare.io/referenda/${proposal.referendumIndex}#${c.height}`,
    }
    flattenedComments.push(mappedComment)
    c.replies.forEach((r) => {
      flattenedComments.push({
        id: r._id,
        username: r.author.address ?? '',
        content: r.content ?? '',
        source: 'subsquare',
        createdAt: r.createdAt ?? '',
        profile: null,
        ownerId: r.author.address ?? '',
        parentComment: mappedComment,
        redirectLink: `https://polkadot.subsquare.io/referenda/${
          proposal.referendumIndex
        }#${c.height ?? ''}`,
      })
    })
  })

  flattenedComments.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  return flattenedComments
}

function getPolkassemblyCommentRedirectLink(
  proposal: SubsquareProposal,
  comment: PolkassemblyCommentWithoutReplies
) {
  if (comment.comment_source === 'polkassembly') {
    return `https://polkadot.polkassembly.io/referenda/${proposal.referendumIndex}#${comment.id}`
  }
  return `https://polkadot.subsquare.io/referenda/${proposal.referendumIndex}`
}
