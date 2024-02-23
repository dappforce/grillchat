import LinkText from '@/components/LinkText'
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

const EarnStats = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='text-2xl font-bold leading-none'>
          How much others earn
        </div>
        <LinkText variant='primary' className='no-underline'>
          How much can I earn ?
        </LinkText>
      </div>
      <div className='grid grid-cols-2 items-stretch gap-4'>
        {mockedData.map((props, i) => (
          <StatsCard key={i} {...props} />
        ))}
      </div>
    </div>
  )
}

export default EarnStats
