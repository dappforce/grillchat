type User = { address: string; reward: string }

export type TopUsers = {
  creators: User[]
}

export type UserStatistics = {
  address: string
  staker: {
    likedCreators: number
    likedPosts: number
    earnedByPeriod: string
    earnedTotal: string
    rank: number | undefined
  }
  creator: {
    likesCountByPeriod: number
    stakersWhoLiked: number
    earnedByPeriod: string
    earnedTotal: string
    rank: number | undefined
  }
}

export type GeneralStatistics = {
  postsLiked: number
  creatorsLiked: number
  stakersEarnedTotal: string
  creatorsEarnedTotal: string
}

export type LeaderboardRole = 'staker' | 'creator'

export type LeaderboardData = {
  total: number
  page: number
  data: { reward: string; rank?: number; address: string }[]
  hasMore: boolean
  role: LeaderboardRole
}

export type RewardHistory = {
  address: string
  rewards: {
    week: number
    startDate: string
    endDate: string
    reward: string
    creatorReward: string
  }[]
}
