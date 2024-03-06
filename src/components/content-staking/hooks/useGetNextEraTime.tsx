import BN from 'bignumber.js'
import { useBlockNumberContext } from '../utils/BlockNumberContext'

export const useGetNextEraTime = (blockNumber?: string) => {
  const { currentTimestamp, currentBlockNumber, blockTime } =
    useBlockNumberContext()

  if (!currentBlockNumber || !currentTimestamp || !blockTime || !blockNumber)
    return new BN(0)

  const nextEraTime = new BN(blockNumber)
    .minus(currentBlockNumber)
    .multipliedBy(blockTime)
    .plus(currentTimestamp)

  return nextEraTime
}
