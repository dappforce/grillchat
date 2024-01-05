import Button from '@/components/Button'
import { SubstrateDonationWrapper } from '@/components/extensions/donate/DonateModal/donateForm/mutation'
import { ChainListItem } from '@/components/extensions/donate/DonateModal/types'
import { useGetChainDataByNetwork } from '@/services/chainsInfo/query'
import { parseUnits } from 'ethers'
import { ProfileModalState } from '../../types'

type SubstrateWithdrawButtonProps = {
  setCurrentState: (state: ProfileModalState) => void
  amount: string
  amountPreview: string
  selectedChain: ChainListItem
  recipient: string
  disabled: boolean
}

const SubstrateWithdrawButton = ({
  setCurrentState,
  amount,
  amountPreview,
  selectedChain,
  recipient,
  disabled,
}: SubstrateWithdrawButtonProps) => {
  const chainData = useGetChainDataByNetwork(selectedChain.id)

  const { decimal } = chainData || {}

  const amountValue = parseUnits(amount || '0', decimal)

  return (
    <SubstrateDonationWrapper
      loadingUntilTxSuccess
      otherProps={{
        chainName: selectedChain.id,
        toDonateForm: () => setCurrentState('withdraw-tokens'),
        toWalletActionRequired: () => setCurrentState('wallet-action-required'),
        toLoading: () => setCurrentState('loading-tx'),
        successTitle: 'Withdraw',
        successDescription: 'You have successfully withdrawn your tokens.',
      }}
    >
      {({ isLoading, mutateAsync: donateTx }) => {
        const onButtonClick = async () => {
          try {
            await donateTx({
              amount: amountValue.toString(),
              recipient: recipient,
            })
            setCurrentState('withdraw-tokens')
          } catch {
            setCurrentState('withdraw-tokens')
            return
          }
        }

        return (
          <Button
            isLoading={isLoading}
            onClick={onButtonClick}
            variant={'primary'}
            size={'lg'}
            disabled={disabled}
          >
            Withdraw {!disabled && amountPreview}
          </Button>
        )
      }}
    </SubstrateDonationWrapper>
  )
}

export default SubstrateWithdrawButton
