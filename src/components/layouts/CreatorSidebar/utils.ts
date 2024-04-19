import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// distribution is at the start of monday, dayjs week starts from sunday: 0, monday: 1, ...
const DISTRIBUTION_DAY = 0
export const CREATORS_CONSTANTS = {
  SUPER_LIKES_FOR_MAX_REWARD: 10,
  DISTRIBUTION_DAY,
  getDistributionDaysLeft() {
    // monday: 7 days, tuesday: 6 days, ..., sunday: 1 day
    return ((DISTRIBUTION_DAY + 7 - dayjs.utc().get('day')) % 7) + 1
  },
}
