import EthIcon from '@/assets/icons/eth.svg'
import PolkadotIcon from '@/assets/icons/polkadot.svg'
import UserIcon from '@/assets/icons/user.svg'
import MenuList from '@/components/MenuList'
import Notice from '@/components/Notice'
import ProfilePreview from '@/components/ProfilePreview'
import { getProfileQuery } from '@/services/api/query'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { ContentProps } from '../types'

export default function AccountSettingsContent({
  address,
  evmAddress,
  setCurrentState,
}: ContentProps) {
  const { data: profile } = getProfileQuery.useQuery(address)
  const hasNickname = !!profile?.profileSpace?.name

  const hasProxyAddress = useMyAccount((state) => !!state.parentProxyAddress)
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
    setCurrentState('polkadot-connect')
  }

  return (
    <div className='flex flex-col'>
      <div className='px-6'>
        <div className={cx('rounded-xl bg-background-lighter p-4')}>
          <ProfilePreview address={address} />
        </div>
      </div>
      <MenuList
        className='mb-1'
        menus={[
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>Nickname</span>
                {hasNickname && <Notice size='sm'>Set</Notice>}
              </span>
            ),
            icon: UserIcon,
            onClick: onNicknameClick,
          },
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>EVM Address</span>
                {evmAddress && <Notice size='sm'>Connected</Notice>}
              </span>
            ),
            icon: EthIcon,
            onClick: onLinkEvmAddressClick,
          },
          {
            text: (
              <span className='flex items-center gap-2'>
                <span>Polkadot Connect</span>
                {hasProxyAddress && <Notice size='sm'>Connected</Notice>}
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
