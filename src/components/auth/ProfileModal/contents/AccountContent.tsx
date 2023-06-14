import BulbIcon from '@/assets/icons/bulb.svg'
import EthIcon from '@/assets/icons/eth.svg'
import ExitIcon from '@/assets/icons/exit.svg'
import InfoIcon from '@/assets/icons/info.svg'
import KeyIcon from '@/assets/icons/key.svg'
import ShareIcon from '@/assets/icons/share.svg'
import MenuList, { MenuListProps } from '@/components/MenuList'
import ProfilePreview from '@/components/ProfilePreview'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import { useSendEvent } from '@/stores/analytics'
import { useDisconnect } from 'wagmi'
import { ContentProps } from '../types'

function AccountContent({
  address,
  setCurrentState,
  notification,
  evmAddress,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const { disconnect } = useDisconnect()

  const onLinkEvmAddressClick = () => {
    sendEvent('click link_evm_address')
    setCurrentState('link-evm-address')
  }
  const onShowPrivateKeyClick = () => {
    sendEvent('click show_private_key_button')
    setCurrentState('private-key')
  }
  const onShareSessionClick = () => {
    sendEvent('click share_session_button')
    setCurrentState('share-session')
  }
  const onLogoutClick = () => {
    disconnect()
    sendEvent('click log_out_button')
    setCurrentState('logout')
  }
  const onAboutClick = () => {
    sendEvent('click about_app_button')
    setCurrentState('about')
  }

  const menus: MenuListProps['menus'] = [
    {
      text: evmAddress ? 'My EVM Address' : 'Link EVM address',
      icon: EthIcon,
      onClick: () => {
        notification?.setNotifDone()
        onLinkEvmAddressClick()
      },
    },
    {
      text: (
        <span>
          <span>Show grill secret key</span>
          {notification?.showNotif && (
            <span className='relative ml-2 h-2 w-2'>
              <span className='absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-background-warning opacity-75'></span>
              <span className='relative block h-full w-full rounded-full bg-background-warning' />
            </span>
          )}
        </span>
      ),
      icon: KeyIcon,
      onClick: () => {
        notification?.setNotifDone()
        onShowPrivateKeyClick()
      },
    },
    { text: 'Share session', icon: ShareIcon, onClick: onShareSessionClick },
    {
      text: 'Suggest feature',
      icon: BulbIcon,
      href: SUGGEST_FEATURE_LINK,
    },
    {
      text: 'About app',
      icon: InfoIcon,
      onClick: onAboutClick,
    },
    { text: 'Log out', icon: ExitIcon, onClick: onLogoutClick },
  ]

  return (
    <div className='mt-2 flex flex-col'>
      <ProfilePreview
        address={address}
        className='border-b border-background-lightest px-6 pb-6'
      />
      <MenuList menus={menus} />
    </div>
  )
}

export default AccountContent
