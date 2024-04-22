import LeaderboardProfilePreview from './LeaderboardProfilePreview'
import LeaderboardStatsData from './LeaderboardStatsData'
import StakerRewards from './StakerRewards'

type MyStatsProps = {
  address: string
}

const MyStats = ({ address }: MyStatsProps) => {
  return (
    <div className='grid grid-cols-[calc(70%-8px),30%] gap-5'>
      <LeaderboardStatsData address={address} />
      <div className='flex flex-col gap-4'>
        <LeaderboardProfilePreview address={address} />
        <StakerRewards address={address} />
      </div>
    </div>
  )
}

export default MyStats
