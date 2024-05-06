import { LeaderboardRole } from '@/services/datahub/leaderboard'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useGetLeaderboardRole = () => {
  const router = useRouter()

  const role = router.query.role as LeaderboardRole
  const address = router.query.address as string

  useEffect(() => {
    if (!role && router.isReady && address) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          role: 'staker',
        },
      })
    }
  }, [role, address])

  return role || 'staker'
}
