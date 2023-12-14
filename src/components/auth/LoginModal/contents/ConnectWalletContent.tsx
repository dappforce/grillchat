import EthIcon from '@/assets/icons/eth.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import MenuList from '@/components/MenuList'
import { useSendEvent } from '@/stores/analytics'
import { LoginModalContentProps } from '../LoginModalContent'

export const ConnectWalletContent = ({
  setCurrentState,
}: LoginModalContentProps) => {
  const sendEvent = useSendEvent()

  return (
    <MenuList
      className='pt-0'
      menus={[
        {
          text: 'EVM',
          icon: EthIcon,
          onClick: () => {
            setCurrentState('evm-address-link')
            sendEvent('start_link_evm_address')
          },
        },
        {
          text: 'Polkadot',
          icon: PolkadotIcon,
          onClick: () => {
            setCurrentState('polkadot-connect')
            sendEvent('start_link_polkadot_address')
          },
        },
      ]}
    />
  )
}
