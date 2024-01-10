import BigNumber from 'bignumber.js'

export const getBalanceInDollars = (balance?: string, price?: string | null) =>
  price && balance ? new BigNumber(price).multipliedBy(balance).toFixed(4) : '0'
