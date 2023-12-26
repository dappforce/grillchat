import { useEffect } from 'react'
import { useDonateModalContext } from '../../DonateModalContext'
import { DonateModalStep } from '../types'
import { CommonFields, CommonFieldsProps } from './CommonFields'

type SubstrateDonateFormProps = Omit<
  CommonFieldsProps,
  'balance' | 'decimals'
> & {
  isOpen: boolean
  onSwitchButtonClick: () => void
  setCurrentStep: (step: DonateModalStep) => void
}

const SubstrateDonateFormPart = ({
  isOpen,
  setCurrentStep,
  selectedChain,
  selectedToken,
  ...otherProps
}: SubstrateDonateFormProps) => {
  const { setShowSwitchButton } = useDonateModalContext()

  useEffect(() => {
    setShowSwitchButton(false)
  }, [])

  return (
    <CommonFields
      selectedToken={selectedToken}
      selectedChain={selectedChain}
      {...otherProps}
    />
  )
}

export default SubstrateDonateFormPart
