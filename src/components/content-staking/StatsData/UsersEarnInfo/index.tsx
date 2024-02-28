import { useState } from 'react'
import SectionWrapper from '../../utils/SectionWrapper'
import UserTypeDropdown from '../UserTypeDropdown'
import EarnCalcSection from './EarnCalcByStaker'
import EarnInfoByCretor from './EarnInfoByCreator'

export type UserType = 'staker' | 'creator'

const UsersEarnInfo = () => {
  const [userType, setUserType] = useState<UserType>('staker')

  return (
    <div className='z-[1] flex flex-col gap-4'>
      <div>
        <span className='text-[28px] font-bold leading-none'>
          How much can I earn as a{' '}
          <UserTypeDropdown value={userType} onChangeValue={setUserType} />
        </span>
      </div>
      <SectionWrapper className='flex flex-col gap-4'>
        {userType === 'staker' ? <EarnCalcSection /> : <EarnInfoByCretor />}
      </SectionWrapper>
    </div>
  )
}

export default UsersEarnInfo
