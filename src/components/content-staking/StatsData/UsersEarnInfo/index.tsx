import { useState } from 'react'
import SectionWrapper from '../../utils/SectionWrapper'
import UserTypeDropdown from '../UserTypeDropdown'
import EarnCalcSection from './EarnCalcByStaker'
import EarnInfoByCretor from './EarnInfoByCreator'

export type UserType = 'staker' | 'creator'

const UsersEarnInfo = () => {
  const [userType, setUserType] = useState<UserType>('staker')

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <div className='text-[28px] font-bold leading-none flex items-center gap-2'>
          How much can I earn as a
          <UserTypeDropdown value={userType} onChangeValue={setUserType} />
        </div>
      </div>
      <SectionWrapper className='flex flex-col gap-4'>
        {userType === 'staker' ? <EarnCalcSection /> : <EarnInfoByCretor />}
      </SectionWrapper>
    </div>
  )
}

export default UsersEarnInfo
