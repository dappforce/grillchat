import { Proposal } from '@/old/server/opengov/mapper'
import { cx } from '@/utils/class-names'
import { ArcElement, Chart } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

Chart.register(ArcElement)

export default function VoteSummary({
  proposal,
  className,
  size = 'default',
}: {
  proposal: Proposal
  className?: string
  size?: 'large' | 'default' | 'small'
}) {
  let ayePercentage = 0
  let nayPercentage = 0
  let isAye = true
  try {
    const aye = BigInt(proposal.tally.ayes)
    const nay = BigInt(proposal.tally.nays)
    isAye = aye > nay

    ayePercentage = Number(((aye * BigInt(100)) / (aye + nay)).toString())
    nayPercentage = Number(((nay * BigInt(100)) / (aye + nay)).toString())
  } catch {}

  let dataset: [number, number]
  let displayedPercentage: number
  if (isAye) {
    displayedPercentage = ayePercentage
    dataset = [displayedPercentage, 100 - displayedPercentage]
  } else {
    displayedPercentage = nayPercentage
    dataset = [100 - displayedPercentage, displayedPercentage]
  }

  return (
    <div className={cx('relative h-24 w-24 flex-shrink-0', className)}>
      <div className='absolute flex h-full w-full items-center justify-center p-2 text-center'>
        <div
          className={cx(
            'absolute h-full w-full rounded-full',
            isAye ? 'bg-[#5EC26933]' : 'bg-[#DC464633]'
          )}
        />
        <div className='flex flex-col items-center'>
          <span
            className={cx(
              'text-sm font-medium text-black dark:text-white',
              size === 'small' && 'text-xs',
              size === 'large' && 'text-base'
            )}
          >
            {displayedPercentage}%
          </span>
          {size !== 'small' && (
            <span className='text-xs text-text-muted'>
              {isAye ? 'Aye' : 'Nay'}
            </span>
          )}
        </div>
      </div>
      <Doughnut
        className='relative'
        options={{
          cutout: '82%',
          backgroundColor: '#000',
          animation: false,
        }}
        data={{
          datasets: [
            {
              data: dataset,
              borderWidth: 0,
              spacing: 0,
              borderJoinStyle: 'round',
              borderAlign: 'inner',
              backgroundColor: ['#5EC269', '#DC4646'],
            },
          ],
        }}
      />
    </div>
  )
}
