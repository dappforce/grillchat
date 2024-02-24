import Stepper from '@/components/Stepper'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'
import { useContentStakingContext } from '../utils/ContentStakingContext'

const StakingStepper = () => {
  const isLoggedIn = useMyAccount((state) => !!state.address)
  const { currentStep, isLockedTokens, isHasSub } = useContentStakingContext()

  const steps = useMemo(() => {
    return [
      {
        id: 'login',
        label: '1',
        title: 'Login',
        isComleted: isLoggedIn,
      },
      {
        id: 'get-sub',
        label: '2',
        title: 'Get SUB',
        isComleted: isHasSub,
      },
      {
        id: 'lock-sub',
        label: '3',
        title: 'Lock SUB',
        isComleted: isLockedTokens,
      },
    ]
  }, [isLoggedIn, isLockedTokens, isHasSub])

  return (
    <Stepper
      className='max-w-[318px] my-3'
      items={steps}
      currentStep={currentStep}
    />
  )
}

export default StakingStepper
