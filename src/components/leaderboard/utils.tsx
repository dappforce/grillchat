import { LeaderboardRole } from '@/services/datahub/leaderboard'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useGetLeaderboardRole = () => {
  const router = useRouter()

  const role = router.query.role as LeaderboardRole

  useEffect(() => {
    if (!role && router.isReady) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          role: 'staker',
        },
      })
    }
  }, [role])

  return role || 'staker'
}
