import {
  Proposal,
  ProposalConfirmationPeriod,
  ProposalDecisionPeriod,
  SubsquareProposal,
} from './mapper'

const POLKADOT_BLOCK_TIME = 6_000

function getBlockTimeForStatus(
  timeline: { indexer: { blockTime: number }; name: string }[],
  status: string
) {
  return timeline.find((t) => t.name === status)?.indexer.blockTime
}

export function getProposalPeriods(
  proposal: SubsquareProposal
): Pick<Proposal, 'decision' | 'confirmation'> {
  const trackInfo = proposal.onchainData.trackInfo
  if (!trackInfo)
    return {
      confirmation: null,
      decision: null,
    }

  return {
    decision: getDecisionData(proposal),
    confirmation: getConfirmationData(proposal),
  }
}

function getDecisionData(
  proposal: SubsquareProposal
): ProposalDecisionPeriod | null {
  const trackInfo = proposal.onchainData.trackInfo

  const startTime = getBlockTimeForStatus(
    proposal.onchainData.timeline ?? [],
    'DecisionStarted'
  )
  const duration = trackInfo.decisionPeriod * POLKADOT_BLOCK_TIME

  if (!startTime) {
    if (!proposal.onchainData?.info?.deciding?.since) return null

    const indexerBlockHeight = proposal.indexer.blockHeight
    const currentBlockHeight =
      indexerBlockHeight +
      (Date.now() - proposal.indexer.blockTime) / POLKADOT_BLOCK_TIME
    const blockLeft =
      proposal.onchainData.info.deciding.since +
      trackInfo.decisionPeriod -
      currentBlockHeight

    return {
      duration,
      timeLeft: blockLeft * POLKADOT_BLOCK_TIME,
    }
  }

  return {
    startTime,
    duration,
    endTime: startTime + duration,
    timeLeft: startTime + duration - Date.now(),
  }
}

function getConfirmationData(
  proposal: SubsquareProposal
): ProposalConfirmationPeriod | null {
  const trackInfo = proposal.onchainData.trackInfo
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

  if (!confirmationStartTime) {
    // Time left can't be calculated from here, because the block time for the start of the confirmation period is not available with the group fetch
    // the `onchainData.info.confirming.since` has different data than the timeline used in detail page
    return {
      duration: confirmationDuration,
      attempt: 1,
    }
  }

  return {
    timeLeft: confirmationStartTime + confirmationDuration - Date.now(),
    startTime: confirmationStartTime,
    duration: confirmationDuration,
    endTime: (confirmationStartTime ?? 0) + confirmationDuration,
    attempt: confirmationAttempt,
  }
}
