import EthIcon from '@/assets/icons/eth.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import UserIcon from '@/assets/icons/user.svg'
import MenuList from '@/components/MenuList'
import Notice from '@/components/Notice'
import ProfilePreview from '@/components/ProfilePreview'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ContentProps } from '../types'

export default function AccountSettingsContent({
  address,
  evmAddress,
  setCurrentState,
}: ContentProps) {
  const hasConnectedWallet = useMyAccount((state) => !!state.connectedWallet)
  const sendEvent = useSendEvent()

  const commonEventProps = { eventSource: 'account_settings_menu' }
  const onLinkEvmAddressClick = () => {
    sendEvent('start_link_evm_address', commonEventProps)
    setCurrentState('link-evm-address')
  }
  const onNicknameClick = () => {
    sendEvent('open_nickname_menu', commonEventProps)
    setCurrentState('subsocial-profile')
  }
  const onPolkadotConnectClick = () => {
    sendEvent('open_polkadot_connect', commonEventProps)
    setCurrentState('substrate-connect')
  }

  return (
    <div className='flex flex-col'>
      <div className='px-6'>
        <div className={cx('rounded-xl bg-background-lighter p-4')}>
          <ProfilePreview address={address} />
        </div>
      </div>
      <MenuList
        menus={[
          { text: 'Nickname', icon: UserIcon, onClick: onNicknameClick },
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>EVM Address</span>
                {evmAddress && (
                  <Notice size='sm' className='relative top-px'>
                    Connected
                  </Notice>
                )}
              </span>
            ),
            icon: EthIcon,
            onClick: onLinkEvmAddressClick,
          },
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>Polkadot Connect</span>
                {hasConnectedWallet && <Notice size='sm'>Connected</Notice>}
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
