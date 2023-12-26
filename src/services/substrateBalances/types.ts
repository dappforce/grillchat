type LocksStruct = {
  id: string
  amount: string
  reasons: string
}

export type BalancesStruct = {
  reservedBalance: string
  frozenBalance: string
  freeBalance: string
  lockedBalance: string
  locks: LocksStruct[]
}

export type AccountInfoByChain = BalancesStruct & {
  accountId: string
  totalBalance: string
}
