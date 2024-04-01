const periodStartAt = (period: string, periodPercent: number) => {
  let startTime = Math.round((parseInt(period) * periodPercent) / 100)
  if (startTime < 0) {
    startTime = 0
  }
  if (startTime > parseInt(period)) {
    startTime = parseInt(period)
  }
  return startTime
}

export default function ProposalDecisionTime() {
  return <div>ProposalDecisionTime</div>
}
