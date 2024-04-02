import {
  Proposal,
  ProposalConfirmationPeriod,
  ProposalDecisionPeriod,
  SubsquareProposal,
} from './mapper'
import { TracksInfo } from './track-info'

const POLKADOT_BLOCK_TIME = 6_000

function getBlockTimeForStatus(
  timeline: { indexer: { blockTime: number }; name: string }[],
  status: string
) {
  return timeline.find((t) => t.name === status)?.indexer.blockTime
}

export function getProposalPeriods(
  allTrackInfo: TracksInfo,
  proposal: SubsquareProposal
): Pick<Proposal, 'decision' | 'confirmation'> {
  const track = proposal.track

  const trackInfo = allTrackInfo[track]
  if (!trackInfo)
    return {
      confirmation: null,
      decision: null,
    }

  return {
    decision: getDecisionData(allTrackInfo, proposal),
    confirmation: getConfirmationData(allTrackInfo, proposal),
  }
}

function getDecisionData(
  allTrackInfo: TracksInfo,
  proposal: SubsquareProposal
): ProposalDecisionPeriod | null {
  const trackInfo = allTrackInfo[proposal.track]
  if (!trackInfo) return null

  const startTime = getBlockTimeForStatus(
    proposal.onchainData.timeline ?? [],
    'DecisionStarted'
  )
  const duration = trackInfo.decisionPeriod * POLKADOT_BLOCK_TIME
  if (!startTime) return null
  return {
    startTime,
    duration,
    endTime: startTime + duration,
  }
}

function getConfirmationData(
  allTrackInfo: TracksInfo,
  proposal: SubsquareProposal
): ProposalConfirmationPeriod | null {
  const trackInfo = allTrackInfo[proposal.track]
  if (!trackInfo) return null

  let confirmationStartTime: number | undefined
  let confirmationAttempt: number = 0
  proposal.onchainData.timeline?.forEach((t) => {
    if (t.name === 'ConfirmStarted') {
      confirmationStartTime = t.indexer.blockTime
      confirmationAttempt++
    }
  })
  const confirmationDuration = trackInfo.confirmPeriod * POLKADOT_BLOCK_TIME

  if (!confirmationStartTime) return null

  return {
    startTime: confirmationStartTime,
    duration: confirmationDuration,
    endTime: (confirmationStartTime ?? 0) + confirmationDuration,
    attempt: confirmationAttempt,
  }
}
