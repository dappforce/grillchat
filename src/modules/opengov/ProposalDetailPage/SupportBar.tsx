import PopOver from '@/components/floating/PopOver'
import { CurveType, Proposal } from '@/server/opengov/mapper'

export default function SupportBar({ proposal }: { proposal: Proposal }) {
  const supportThreshold = getSupportThreshold(proposal)
  if (!supportThreshold) return null

  const threshold = Number(supportThreshold) * Math.pow(10, 9)

  const supportPerBill = calcPerbill(
    parseInt(proposal.tally.support),
    parseInt(proposal.tally.electorate)
  )
  const progressMax = BigNumber.max(supportPerBill, threshold)
    .multipliedBy(1.25)
    .toNumber()

  const markThreshold = Number((threshold / progressMax) * 100).toFixed(2)
  const barPercentage = parseInt(
    Number((supportPerBill / progressMax) * 100).toFixed(0)
  )

  const currentBill = getSupportPercentage(supportPerBill)
  console.log(markThreshold)

  return (
    <div className='flex flex-col gap-2 text-sm'>
      <div className='relative grid grid-cols-2 justify-between gap-2 whitespace-nowrap'>
        <span>0.0%</span>
        <span className='text-right'>{getSupportPercentage(progressMax)}</span>
      </div>
      <PopOver
        placement='bottom'
        panelSize='sm'
        yOffset={8}
        triggerOnHover
        trigger={
          <div
            className='relative grid h-1.5 w-full bg-background-lighter'
            style={{
              gridTemplateColumns: `${barPercentage}fr ${
                100 - barPercentage
              }fr`,
            }}
          >
            <div
              className='absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#C3C8D4]'
              style={{ left: `${markThreshold}%` }}
            />
            <div className='h-full rounded-full bg-background-primary' />
          </div>
        }
      >
        <span>Support: {currentBill}</span>
      </PopOver>
      <div className='relative'>
        <div
          className='absolute flex -translate-x-1/2 flex-col items-center justify-center text-center text-xs text-text-muted'
          style={{ left: `${markThreshold}%` }}
        >
          <span>{getSupportPercentage(threshold)}</span>
          <span>Threshold</span>
        </div>
        <span className='pointer-events-none flex flex-col text-xs opacity-0'>
          <span>0</span>
          <span>Threshold</span>
        </span>
      </div>
    </div>
  )
}

export function getCurrentBillPercentage(proposal: Proposal) {
  const supportThreshold = getSupportThreshold(proposal)
  if (!supportThreshold) return null

  const supportPerBill = calcPerbill(
    parseInt(proposal.tally.support),
    parseInt(proposal.tally.electorate)
  )

  const currentBill = getSupportPercentage(supportPerBill)
  return currentBill
}

function getSupportPercentage(perbill: number) {
  if (!perbill || perbill <= 0) {
    return '0.0%'
  }

  const precision = perbill > 10 * Math.pow(10, 7) ? 1 : 2
  return ((perbill / Math.pow(10, 9)) * 100).toFixed(precision) + '%'
}

function getSupportThreshold(proposal: Proposal) {
  if (!proposal.trackInfo) return null

  const supportCurve = makeCurve(proposal.trackInfo.minSupport)
  if (!proposal.decision || !('startBlock' in proposal.decision)) {
    return null
  }
  const decidingSince = proposal.decision.startBlock
  const endHeight = proposal.finished?.block ?? proposal.latestBlock
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
  return supportThreshold
}

function calcPerbill(numerator = 0, denominator = 0) {
  if (!denominator) {
    return 0
  }

  return new BigNumber(numerator)
    .div(denominator)
    .multipliedBy(Math.pow(10, 9))
    .toNumber()
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
