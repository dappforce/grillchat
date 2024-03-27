import { Proposal } from '@/pages/api/opengov/proposals'
import { ArcElement, Chart } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

Chart.register(ArcElement)

export default function VoteSummary({ proposal }: { proposal: Proposal }) {
  return (
    <div className='relative h-24 w-24 flex-shrink-0'>
      <div className='absolute flex h-full w-full items-center justify-center p-2 text-center'>
        <div className='absolute h-full w-full rounded-full bg-[#5EC26933]' />
        <div className='flex flex-col items-center'>
          <span className='text-sm font-medium text-black dark:text-white'>
            72%
          </span>
          <span className='text-xs text-text-muted'>Aye</span>
        </div>
      </div>
      <Doughnut
        className='relative'
        options={{ cutout: 40, backgroundColor: '#000', animation: false }}
        data={{
          datasets: [
            {
              data: [50, 30],
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
