import { Proposal } from '@/pages/api/opengov/proposals'
import { cx } from '@/utils/class-names'
import { ArcElement, Chart } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

Chart.register(ArcElement)

export default function VoteSummary({ proposal }: { proposal: Proposal }) {
  let ayePercentage = 0
  let nayPercentage = 0
  let isAye = true
  try {
    const aye = BigInt(proposal.vote.ayes)
    const nay = BigInt(proposal.vote.nays)
    isAye = aye > nay

    ayePercentage = Number(((aye * BigInt(100)) / (aye + nay)).toString())
    nayPercentage = Number(((nay * BigInt(100)) / (aye + nay)).toString())
  } catch {}

  return (
    <div className='relative h-24 w-24 flex-shrink-0'>
      <div className='absolute flex h-full w-full items-center justify-center p-2 text-center'>
        <div
          className={cx(
            'absolute h-full w-full rounded-full',
            isAye ? 'bg-[#5EC26933]' : 'bg-[#DC464633]'
          )}
        />
        <div className='flex flex-col items-center'>
          <span className='text-sm font-medium text-black dark:text-white'>
            {isAye ? ayePercentage : nayPercentage}%
          </span>
          <span className='text-xs text-text-muted'>
            {isAye ? 'Aye' : 'Nay'}
          </span>
        </div>
      </div>
      <Doughnut
        className='relative'
        options={{ cutout: 40, backgroundColor: '#000', animation: false }}
        data={{
          datasets: [
            {
              data: [ayePercentage, nayPercentage],
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