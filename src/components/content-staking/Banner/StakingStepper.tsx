import Stepper from '@/components/Stepper'

type Steps = 'login' | 'get-sub' | 'lock-sub'

const StakingStepper = () => {
  const steps = [
    {
      id: 'login',
      label: '1',
      title: 'Login',
      isComleted: true,
    },
    {
      id: 'get-sub',
      label: '2',
      title: 'Get SUB',
      isComleted: false,
    },
    {
      id: 'lock-sub',
      label: '3',
      title: 'Lock SUB',
      isComleted: false,
    },
  ]

  return (
    <Stepper className='max-w-[318px]' items={steps} currentStep={'login'} />
  )
}

export default StakingStepper
