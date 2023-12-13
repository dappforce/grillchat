import EthIcon from '@/assets/icons/eth.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import MenuList from '@/components/MenuList'
import Notice from '@/components/Notice'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { ContentProps } from '../types'

export default function LinkedAddressesContent({
  evmAddress,
  setCurrentState,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const preferredWallet = useMyAccount((state) => state.preferredWallet)

  const commonEventProps = { eventSource: 'account_settings_menu' }
  const onLinkEvmAddressClick = () => {
    sendEvent('start_link_evm_address', commonEventProps)
    setCurrentState('link-evm-address')
  }
  const onPolkadotConnectClick = () => {
    sendEvent('start_link_polkadot_address', commonEventProps)
    if (preferredWallet) setCurrentState('polkadot-connect-account')
    else setCurrentState('polkadot-connect')
  }

  return (
    <div className='flex flex-col'>
      <MenuList
        className='mb-1 pt-0'
        menus={[
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>EVM</span>
                {evmAddress && (
                  <Notice size='sm'>{truncateAddress(evmAddress)}</Notice>
                )}
              </span>
            ),
            icon: EthIcon,
            onClick: onLinkEvmAddressClick,
          },
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>Polkadot</span>
                {parentProxyAddress && (
                  <Notice size='sm'>
                    {truncateAddress(parentProxyAddress)}
                  </Notice>
                )}
              </span>
            ),
            icon: PolkadotIcon,
            onClick: onPolkadotConnectClick,
          },
        ]}
      />
    </div>
  )
}
