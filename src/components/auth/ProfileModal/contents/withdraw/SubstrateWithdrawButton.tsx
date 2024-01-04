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
}

const SubstrateWithdrawButton = ({
  setCurrentState,
  amount,
  amountPreview,
  selectedChain,
  recipient,
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
        toWalletActionRequired: () => setCurrentState('withdraw-tokens'),
      }}
    >
      {({ isLoading, mutateAsync: donateTx }) => {
        const onButtonClick = async () => {
          try {
            await donateTx({
              amount: amountValue.toString(),
              recipient: recipient,
            })
          } catch {
            return
          }
        }

        return (
          <Button
            isLoading={isLoading}
            onClick={onButtonClick}
            variant={'primary'}
            size={'lg'}
          >
            Withdraw {amountPreview}
          </Button>
        )
      }}
    </SubstrateDonationWrapper>
  )
}

export default SubstrateWithdrawButton
