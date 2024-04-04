import ProposalStatus from '@/components/opengov/ProposalStatus'
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
    trackInfo: {
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
export type Proposal = {
  id: number
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
  trackInfo: SubsquareProposal['onchainData']['trackInfo']
  metadata: {
    submissionDeposit: {
      who: string
      amount: number
    } | null
    decisionDeposit: {
      who: string
      amount: number
    } | null
    decisionPeriod: BlockTime
    confirmingPeriod: BlockTime
    enact: { block: number }
    hash: string
  }
}

export function mapSubsquareProposalToProposal(
  proposal: SubsquareProposal
): Proposal {
  const decisionDeposit = proposal.onchainData?.info?.decisionDeposit ?? null
  if (decisionDeposit) {
    decisionDeposit.who = toSubsocialAddress(decisionDeposit.who)!
  }

  const submissionDeposit =
    proposal.onchainData?.info?.submissionDeposit ?? null
  if (submissionDeposit) {
    submissionDeposit.who = toSubsocialAddress(submissionDeposit.who)!
  }
  return {
    id: proposal.referendumIndex,
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
    trackInfo: proposal.onchainData.trackInfo,
    metadata: {
      decisionDeposit,
      submissionDeposit,
      confirmingPeriod: {
        block: proposal.onchainData.trackInfo.confirmPeriod,
        time:
          proposal.onchainData.trackInfo.confirmPeriod * POLKADOT_BLOCK_TIME,
      },
      decisionPeriod: {
        block: proposal.onchainData.trackInfo.decisionPeriod,
        time:
          proposal.onchainData.trackInfo.decisionPeriod * POLKADOT_BLOCK_TIME,
      },
      enact: {
        block: proposal.onchainData.trackInfo.minEnactmentPeriod,
      },
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
