import Button from '@/components/Button'
import { useEffect } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import { chainIdByChainName } from '../../api/config'
import { useGetBalance } from '../../api/hooks'
import { useDonateModalContext } from '../../DonateModalContext'
import { DonateModalStep } from '../types'
import { CommonFields, CommonFieldsProps } from './CommonFields'

type EvmDonateFormProps = Omit<CommonFieldsProps, 'balance' | 'decimals'> & {
  isOpen: boolean
  onSwitchButtonClick: () => void
  setCurrentStep: (step: DonateModalStep) => void
}

const EvmDonateFormPart = ({
  selectedChain,
  selectedToken,
  isOpen,
  onSwitchButtonClick,
  ...otherProps
}: EvmDonateFormProps) => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  const { setShowChatForm } = useDonateModalContext()

  const { balance, decimals } = useGetBalance(
    selectedToken.id,
    selectedChain.id,
    isOpen
  )

  const currentChainId = chain?.id
  const destChainId = chainIdByChainName[selectedChain.id]

  const showSwitchButton = !isConnected || currentChainId !== destChainId

  useEffect(() => {
    setShowChatForm(!showSwitchButton)
  }, [showSwitchButton])

  return showSwitchButton ? (
    <Button size={'lg'} onClick={onSwitchButtonClick}>
      {!isConnected ? 'Connect' : 'Switch'} to {selectedChain.label}
    </Button>
  ) : (
    <CommonFields
      selectedToken={selectedToken}
      selectedChain={selectedChain}
      {...otherProps}
    />
  )
}

export default EvmDonateFormPart
