import ProposalStatus from '@/components/opengov/ProposalStatus'
import { toSubsocialAddress } from '@subsocial/utils'
import { getProposalPeriods } from './data'

export type ProposalStatus =
  | 'Confirming'
  | 'Deciding'
  | 'Preparing'
  | 'Approved'
  | 'Rejected'
  | 'Executed'
  | 'Rejected'

export type SubsquareProposal = {
  title: string
  referendumIndex: number
  proposer: string
  track: number
  content: string
  state: {
    name: ProposalStatus
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
    timeline?: { indexer: { blockTime: number }; name: string }[]
  }
}

export type ProposalDecisionPeriod = {
  startTime: number
  duration: number
  endTime: number
}
export type ProposalConfirmationPeriod = {
  startTime: number
  duration: number
  endTime: number
  attempt: number
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
    ...getProposalPeriods(proposal),
  }
}
