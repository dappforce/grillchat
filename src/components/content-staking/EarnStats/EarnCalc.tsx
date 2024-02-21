import RangeInput from '@/components/inputs/RangeInput'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import StatsCard from './StatsCard'
const mockedData = [
  {
    title: 'Total SUB earned by stakers',
    desc: '1,123,434 SUB',
    subDesc: '$15,656.34',
    tooltipText: 'blablabla',
  },
  {
    title: 'Total participants',
    desc: '217',
    tooltipText: 'blablabla',
  },
]

type RangeLabelProps = {
  label: string
  desc: string
  className?: string
}

const RangeLabel = ({ label, desc, className }: RangeLabelProps) => {
  return (
    <div className={cx('flex flex-col font-medium', className)}>
      <span className='text-lg text-text leading-[26px]'>{label}</span>
      <span className='text-base text-text/80 leading-[26px]'>{desc}</span>
    </div>
  )
}

const EarnCalcSection = () => {
  const [rangeValue, setRangeValue] = useState(0)

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div className='text-2xl font-bold leading-none'>
          How much can I earn
        </div>
      </div>
      <div className='rounded-2xl bg-white/5 p-4'>
        <div className='mb-11 text-base text-text'>
          How much would you like to stake?
        </div>
        <RangeInput
          value={rangeValue}
          setValue={setRangeValue}
          min={20}
          max={10000}
          valueLabel={
            <RangeLabel
              label={'$' + rangeValue.toString()}
              desc='2000 SUB'
              className='text-center'
            />
          }
          rangeLabels={{
            minLabel: <RangeLabel label={'$20'} desc='2000 SUB' />,
            middleLabel: (
              <RangeLabel
                label={'$5000'}
                desc='100,000 SUB'
                className='text-center'
              />
            ),
            maxLabel: (
              <RangeLabel
                label={'$10,000'}
                desc='1,000,000 SUB'
                className='text-end'
              />
            ),
          }}
        />
      </div>
      <div className='grid grid-cols-2 items-center gap-4'>
        {mockedData.map((props, i) => (
          <StatsCard key={i} {...props} />
        ))}
      </div>
    </div>
  )
}

export default EarnCalcSection
