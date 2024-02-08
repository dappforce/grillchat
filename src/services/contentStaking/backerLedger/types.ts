type UnbondingChunks = {
  amount: string
  unlockEra: string
}

export type BackerLedger = {
  account: string
  totalLocked: string
  locked: string
  unbondingInfo: {
    unbondingChunks: UnbondingChunks[]
  }
}