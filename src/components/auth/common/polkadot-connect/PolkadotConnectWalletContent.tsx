import SubwalletIcon from '@/assets/icons/subwallet.png'
import Button from '@/components/Button'
import MenuList, { MenuListProps } from '@/components/MenuList'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import { getIsInIframe, isInMobileOrTablet } from '@/utils/window'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { FiDownload } from 'react-icons/fi'
import urlJoin from 'url-join'
import { PolkadotConnectContentProps } from './types'

export default function PolkadotConnectWalletContent({
  setCurrentState,
}: PolkadotConnectContentProps) {
  const sendEvent = useSendEvent()
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const supportedWallets: Wallet[] = getWallets()

  const installedWallets: Wallet[] = []
  const otherWallets: Wallet[] = []
  supportedWallets.forEach((wallet) => {
    // polkadot js doesn't inject its web3 object inside iframe
    // issue link: https://github.com/polkadot-js/extension/issues/1274
    const isPolkadotJsNotInstalledAndInIframe =
      wallet.title.toLowerCase() === 'polkadot.js' &&
      !wallet.installed &&
      getIsInIframe()
    if (isPolkadotJsNotInstalledAndInIframe) return

    if (wallet.installed) installedWallets.push(wallet)
    else otherWallets.push(wallet)
  })
  let hasInstalledWallet = installedWallets.length

  let menus: MenuListProps['menus'] = [
    ...installedWallets,
    ...otherWallets,
  ].map((wallet: Wallet) => {
    return {
      text: (
        <div className='flex w-full items-center justify-between gap-4'>
          <span
            className={cx(
              !wallet.installed &&
                'opacity-30 dark:opacity-100 dark:brightness-50'
            )}
          >
            {wallet.title}
          </span>
          {!wallet.installed && (
            <Button
              size='circle'
              variant='primaryOutline'
              href={wallet.installUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FiDownload />
            </Button>
          )}
        </div>
      ),
      className: cx(
        'gap-4',
        !wallet.installed &&
          'focus:bg-transparent hover:bg-transparent cursor-default'
      ),
      icon: () => (
        <Image
          width={32}
          height={32}
          className='h-10 w-10 flex-shrink-0 object-contain'
          src={
            wallet.title.toLowerCase() === 'subwallet'
              ? SubwalletIcon
              : wallet.logo.src
          }
          alt={wallet.logo.alt}
        />
      ),
      onClick: () => {
        if (!wallet.installed) return

        setPreferredWallet(wallet)
        setCurrentState('polkadot-connect-account')
        sendEvent('select_polkadot_wallet', { kind: wallet.title })
      },
    }
  })

  if (!hasInstalledWallet && isInMobileOrTablet()) {
    // Currently, if the url contains encoded / (%252F) inside the link, it will not open the link, instead open search engine
    const urlToGo = urlJoin(
      getCurrentUrlOrigin(),
      `/account?${ACCOUNT_SECRET_KEY_URL_PARAMS}=${
        useMyAccount.getState().encodedSecretKey
      }`
    )
    menus = [
      {
        icon: () => (
          <Image
            width={32}
            height={32}
            className='h-10 w-10 flex-shrink-0 object-contain'
            src={SubwalletIcon}
            alt='Subwallet'
          />
        ),
        text: 'Subwallet',
        className: cx('gap-4'),
        href: `https://mobile.subwallet.app/browser?url=${encodeURIComponent(
          urlToGo
        )}`,
      },
    ]
  }

  return (
    <div className='flex flex-col'>
      <MenuList className='pt-0' menus={menus} />
    </div>
  )
}
