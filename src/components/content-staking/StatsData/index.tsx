import { useContentStakingContext } from '../utils/ContentStakingContext'
import EarnStats from './EarnStats'
import HowToGetRewardsSection from './HowToGetRewardsSection'

const StatsData = () => {
  const { isLockedTokens } = useContentStakingContext()

  return (
    <div className='z-[1]'>
      {isLockedTokens ? <HowToGetRewardsSection /> : <EarnStats />}
    </div>
  )
}

export default StatsData
