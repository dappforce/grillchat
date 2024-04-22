const tmpData = [
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
  {
    date: '07.01.24',
    rewardValue: '+ 34.59 SUB',
  },
]

type StakerRewardsProps = {
  address: string
}

const StakerRewards = ({ address }: StakerRewardsProps) => {
  return (
    <div className='flex flex-col gap-5 rounded-2xl bg-slate-800 p-4'>
      <div className='flex flex-col gap-2'>
        <span className='text-lg font-bold leading-normal'>Staker Rewards</span>
        <span className='text-sm font-normal leading-[22px] text-text-muted'>
          The last 30 days of my Content Staking rewards
        </span>
      </div>
      <div className='flex flex-col gap-5'>
        {tmpData.map((item, index) => (
          <RewardsRow
            key={index}
            date={item.date}
            rewardValue={item.rewardValue}
          />
        ))}
      </div>
    </div>
  )
}

type RewardsRowProps = {
  date: string
  rewardValue: string
}

const RewardsRow = ({ date, rewardValue }: RewardsRowProps) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <span className='text-sm leading-[22px] text-text-muted'>{date}</span>
      <span className='text-base font-semibold'>{rewardValue}</span>
    </div>
  )
}

export default StakerRewards
