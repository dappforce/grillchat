import PopOver from '@/components/floating/PopOver'
import { FiInfo } from 'react-icons/fi'

type StatsCardProps = {
  title: string
  desc: string
  subDesc?: string
  tooltipText: string
}

const StatsCard = ({ title, desc, subDesc, tooltipText }: StatsCardProps) => {
  return (
    <div className='flex w-full h-full flex-col gap-2 rounded-2xl bg-white/5 p-4'>
      <div className='text-sm font-normal text-slate-400'>
        <PopOver
          trigger={
            <div className='flex items-center gap-2'>
              {title}
              <FiInfo className='block text-xs' />
            </div>
          }
          panelSize='sm'
          yOffset={4}
          placement='top'
          triggerOnHover
        >
          {tooltipText}
        </PopOver>
      </div>
      <div className='text-2xl font-semibold text-text'>{desc}</div>
      {subDesc && (
        <div className='text-base font-normal text-slate-400'>{subDesc}</div>
      )}
    </div>
  )
}

export default StatsCard
