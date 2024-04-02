import ProposalStatus from '@/components/opengov/ProposalStatus'
import { toSubsocialAddress } from '@subsocial/utils'
import { POLKADOT_BLOCK_TIME, getProposalPeriods } from './data'

export type ProposalStatus =
  | 'Confirming'
  | 'Deciding'
  | 'Preparing'
  | 'Approved'
  | 'Rejected'
  | 'Executed'
  | 'Rejected'

type ApprovalType =
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
      minApproval: ApprovalType
      minSupport: ApprovalType
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
    }
    proposalHash: string
    treasuryInfo?: {
      amount: string
      beneficiary: string
    }
    timeline?: { indexer: { blockTime: number }; name: string }[]
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
  vote: {
    total: string
    ayes: string
    nays: string
  }
  status: ProposalStatus

  decision: ProposalDecisionPeriod | null
  confirmation: ProposalConfirmationPeriod | null
  metadata: {
    submissionDeposit: {
      who: string
      amount: number
    } | null
    decisionDeposit: {
      who: string
      amount: number
    } | null
    decisionPeriod: {
      block: number
      time: number
    }
    confirmingPeriod: {
      block: number
      time: number
    }
    enact: {
      block: number
    }
    hash: string
  }
}

export function mapSubsquareProposalToProposal(
  proposal: SubsquareProposal
): Proposal {
  return {
    id: proposal.referendumIndex,
    beneficiary: proposal.onchainData.treasuryInfo?.beneficiary ?? '',
    proposer: toSubsocialAddress(proposal.proposer)!,
    requested: BigInt(
      proposal.onchainData.treasuryInfo?.amount ?? '0'
    ).toString(),
    status: proposal.state.name,
    title: proposal.title,
    vote: {
      ayes: BigInt(proposal.onchainData.tally.ayes ?? '0').toString(),
      nays: BigInt(proposal.onchainData.tally.nays ?? '0').toString(),
      total: BigInt(proposal.onchainData.tally.support ?? '0').toString(),
    },
    type: proposal.onchainData.info.origin.origins,
    track: proposal.track,
    content: proposal.content,
    metadata: {
      decisionDeposit: proposal.onchainData?.info?.decisionDeposit ?? null,
      submissionDeposit: proposal.onchainData?.info?.submissionDeposit ?? null,
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
    ...getProposalPeriods(proposal),
  }
}
