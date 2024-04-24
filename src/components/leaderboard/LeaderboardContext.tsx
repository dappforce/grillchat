import { createContext, useContext, useState } from 'react'
import { LeaderboardRole } from '../../services/datahub/leaderboard/index'

export type LeaderboardContextState = {
  leaderboardRole: LeaderboardRole
  setLeaderboardRole: (role: LeaderboardRole) => void
}

const LeaderboardContext = createContext<LeaderboardContextState>({} as any)

type ContextWrapperProps = {
  children: React.ReactNode
}

export const LeaderboardContextWrapper: React.FC<ContextWrapperProps> = ({
  children,
}) => {
  const [leaderboardRole, setLeaderboardRole] =
    useState<LeaderboardRole>('staker')

  const value = {
    leaderboardRole,
    setLeaderboardRole,
  }

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  )
}

export const useLeaderboardContext = () => useContext(LeaderboardContext)
