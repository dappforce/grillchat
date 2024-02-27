import { useContentStakingContext } from '../utils/ContentStakingContext'
import EarnStats from './EarnStats'
import HowToGetRewardsSection from './HowToGetRewardsSection'

const StatsData = () => {
  const { isLockedTokens } = useContentStakingContext()
  
  return isLockedTokens ? <HowToGetRewardsSection /> : <EarnStats />
}

export default StatsData
