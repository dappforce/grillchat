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
    rank: number | null
    earnedPointsByPeriod: number
  }
  creator: {
    likesCountByPeriod: number
    stakersWhoLiked: number
    earnedByPeriod: string
    earnedTotal: string
    rank: number | null
    earnedPointsByPeriod: number
  }
}

export type GeneralStatistics = {
  postsLiked: number
  creatorsLiked: number
  stakersEarnedTotal: string
  creatorsEarnedTotal: string
  creatorEarnedPointsTotal: string
  stakersEarnedPointsTotal: string
}

export type LeaderboardDataPeriod = 'allTime' | 'week'

export type LeaderboardData = {
  total: number
  page: number
  data: { reward: string; rank: number | null; address: string }[]
  hasMore: boolean
  role: LeaderboardDataPeriod
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
