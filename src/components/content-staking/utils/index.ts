import { AccountInfoByChain } from '@/services/substrateBalances/types'
import BN from 'bignumber.js'

export const ACTIVE_STAKING_SPACE_ID = '12361'

export const calculateBalanceForStaking = (
  data?: AccountInfoByChain,
  lockId?: string
) => {
  if (!data) return new BN('0')
  const { totalBalance, locks } = data

  const stakingLockedBalance = locks?.find(({ id }) => id === lockId)

  if (!stakingLockedBalance) return new BN(totalBalance || '0')

  return new BN(totalBalance).minus(new BN(stakingLockedBalance.amount))
}
