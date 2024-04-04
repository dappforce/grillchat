import { CurveType, Proposal } from '@/server/opengov/mapper'

export default function SupportBar({ proposal }: { proposal: Proposal }) {
  const supportCurve = makeCurve(proposal.trackInfo.minApproval)
  if (!proposal.decision || !('startBlock' in proposal.decision)) {
    return null
  }
  const decidingSince = proposal.decision.startBlock
  const endHeight = proposal.latestBlock // TODO: or confirmation end block
  const decisionPeriod = proposal.trackInfo.decisionPeriod

  if (!endHeight) {
    return null
  }

  if (!decidingSince) {
    return null
  }

  const gone = endHeight - decidingSince
  const percentage = Math.min(gone / decisionPeriod, 1)

  const supportThreshold = supportCurve?.(percentage)
  if (!supportThreshold) return null

  return <div>{parseInt(supportThreshold) * Math.pow(10, 9)}</div>
}

function makeCurve(curveField: CurveType) {
  if (!curveField) {
    return null
  }

  if ('reciprocal' in curveField) {
    const { factor, xOffset, yOffset } = curveField.reciprocal
    return makeReciprocalCurve(factor, xOffset, yOffset)
  }

  if ('linearDecreasing' in curveField) {
    const { length, floor, ceil } = curveField.linearDecreasing
    return makeLinearCurve(length, floor, ceil)
  }

  return null
}

import BigNumber from 'bignumber.js'

/**
 * Generate reciprocal curve function.
 * @param factor
 * @param xOffset
 * @param yOffset
 * @returns {function(*=): string} approval percentage
 */
export function makeReciprocalCurve(
  factor: number,
  xOffset: number,
  yOffset: number
) {
  return function (percentage: number) {
    const x = percentage * Math.pow(10, 9)

    const v = new BigNumber(factor)
      .div(new BigNumber(x).plus(xOffset))
      .multipliedBy(Math.pow(10, 9))
      .toFixed(0, BigNumber.ROUND_DOWN)

    const calcValue = new BigNumber(v)
      .plus(yOffset)
      .div(Math.pow(10, 9))
      .toString()
    return BigNumber.max(calcValue, 0).toString()
  }
}

/**
 * Generate linear curve function.
 * @param length
 * @param floor
 * @param ceil
 * @returns {function(*=): string}
 */
export function makeLinearCurve(length: number, floor: number, ceil: number) {
  return function (percentage: number) {
    const x = percentage * Math.pow(10, 9)

    const xValue = BigNumber.min(x, length)
    const slope = new BigNumber(ceil).minus(floor).dividedBy(length)
    const deducted = slope.multipliedBy(xValue).toString()

    const perbill = new BigNumber(ceil)
      .minus(deducted)
      .toFixed(0, BigNumber.ROUND_DOWN)
    const calcValue = new BigNumber(perbill).div(Math.pow(10, 9)).toString()
    return BigNumber.max(calcValue, 0).toString()
  }
}
