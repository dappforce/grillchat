export type BackerRewards = {
  totalRewards: string
  spaceIds: string[]
}

export type RewardsData = {
  account: string
  availableClaimsBySpaceId: Record<string, string>
  rewards: BackerRewards
}
