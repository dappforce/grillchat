import RangeInput from '@/components/inputs/RangeInput'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import SectionWrapper from '../utils/SectionWrapper'
import { StatsCardContent } from './StatsCard'
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
      <span className='text-lg leading-[26px] text-text'>{label}</span>
      <span className='text-base leading-[26px] text-text-muted'>{desc}</span>
    </div>
  )
}

const EarnCalcSection = () => {
  const [rangeValue, setRangeValue] = useState(1000)

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div className='text-2xl font-bold leading-none'>
          How much can I earn
        </div>
      </div>
      <SectionWrapper className='flex flex-col gap-4'>
        <div className='p-4'>
          <div className='mb-16 text-base text-text'>
            How much would you like to stake?
          </div>
          <RangeInput
            value={rangeValue}
            setValue={setRangeValue}
            min={20}
            max={10000}
            valueLabel={
              <div
                className={cx('flex flex-col gap-2 text-center font-medium')}
              >
                <span className='text-base leading-none text-white'>
                  ${rangeValue.toString()}
                </span>
                <span className='text-sm leading-none text-white/80'>
                  2000 SUB
                </span>
              </div>
            }
            rangeLabels={{
              minLabel: <RangeLabel label={'$20'} desc='2000 SUB' />,
              middleLabel: (
                <RangeLabel
                  label={'$5000'}
                  desc='100,000 SUB'
                  className='absolute left-1/2 -translate-x-1/2 transform text-center'
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
        <div className='border-t-[1px] border-t-white/20'>
          <div className='flex w-full items-stretch px-4'>
            <div className='flex w-full flex-col items-center gap-2 py-4 text-center'>
              <StatsCardContent
                title='Your minimum rewards:'
                desc={'34.35 SUB / week'}
                tooltipText={'blablabla'}
                titleClassName='justify-center'
                subDesc='$56.34'
              />
            </div>
            <div className='border-l-[1px] border-l-white/20'></div>
            <div className='flex w-full flex-col items-center gap-2 py-4 text-center'>
              <StatsCardContent
                title='Your maximum rewards:'
                desc={'144.35 SUB / week'}
                tooltipText={'blablabla'}
                titleClassName='justify-center'
                subDesc='$210.37'
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}

export default EarnCalcSection
