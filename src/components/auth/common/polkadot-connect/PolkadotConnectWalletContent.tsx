import WalletIcon from '@/assets/graphics/wallet.svg'
import SubwalletIcon from '@/assets/icons/subwallet.png'
import Button from '@/components/Button'
import PopOver from '@/components/floating/PopOver'
import MenuList, { MenuListProps } from '@/components/MenuList'
import { env } from '@/env.mjs'
import useIsInIframe from '@/hooks/useIsInIframe'
import { ACCOUNT_SECRET_KEY_URL_PARAMS } from '@/pages/account'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import { isInMobileOrTablet } from '@/utils/window'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { useEffect } from 'react'
import { FiDownload } from 'react-icons/fi'
import urlJoin from 'url-join'
import { PolkadotConnectContentProps } from './types'

function getShouldWalletDisabled(wallet: Wallet, isInIframe: boolean) {
  const isPolkadotJsAndInIframe =
    wallet.title.toLowerCase() === 'polkadot.js' && isInIframe
  return {
    disabled: !isPolkadotJsAndInIframe && !wallet.installed,
    isPolkadotJsAndInIframe,
  }
}

export default function PolkadotConnectWalletContent({
  setCurrentState,
}: PolkadotConnectContentProps) {
  const isInIframe = useIsInIframe()
  const sendEvent = useSendEvent()
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const supportedWallets: Wallet[] = getWallets()

  const installedWallets: Wallet[] = []
  const otherWallets: Wallet[] = []
  supportedWallets.forEach((wallet) => {
    // polkadot js doesn't inject its web3 object inside iframe
    // issue link: https://github.com/polkadot-js/extension/issues/1274
    if (!getShouldWalletDisabled(wallet, isInIframe).disabled)
      installedWallets.push(wallet)
    else otherWallets.push(wallet)
  })
  let hasInstalledWallet = installedWallets.length

  useEffect(() => {
    const installed = getWallets().reduce((acc, wallet) => {
      acc[wallet.extensionName] = wallet.installed ?? false
      return acc
    }, {} as Record<string, boolean>)
    if (isInMobileOrTablet() && hasInstalledWallet) {
      installed['nova'] = true
    }
    sendEvent('login_polkadot_opened', installed)
  }, [sendEvent, hasInstalledWallet])

  let menus: MenuListProps['menus'] = [
    ...installedWallets,
    ...otherWallets,
  ].map((wallet: Wallet) => {
    return {
      text: (
        <div className='flex w-full items-center justify-between gap-4'>
          <span
            className={cx(
              getShouldWalletDisabled(wallet, isInIframe).disabled &&
                'opacity-30 dark:opacity-100 dark:brightness-50'
            )}
          >
            {wallet.title}
          </span>
          {/* Polkadot js in iframe is detected as not installed even if it does already */}
          {getShouldWalletDisabled(wallet, isInIframe).disabled && (
            <PopOver
              panelSize='sm'
              triggerOnHover
              placement='top'
              yOffset={8}
              trigger={
                <Button
                  size='circle'
                  variant='primaryOutline'
                  href={wallet.installUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <FiDownload />
                </Button>
              }
            >
              <p>Install this extension</p>
            </PopOver>
          )}
        </div>
      ),
      className: cx(
        'gap-4',
        getShouldWalletDisabled(wallet, isInIframe).disabled &&
          'focus-visible:bg-transparent hover:bg-transparent cursor-default'
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
        if (
          getShouldWalletDisabled(wallet, isInIframe).isPolkadotJsAndInIframe
        ) {
          setCurrentState('polkadot-js-limited-support')
          return
        }
        if (!wallet.installed) return

        sendEvent('login_polkadot_wallet_clicked', {
          value: wallet.extensionName,
        })

        setPreferredWallet(wallet)
        setCurrentState('polkadot-connect-account')
        sendEvent('select_polkadot_wallet', { kind: wallet.title })
      },
    }
  })

  if (isInMobileOrTablet()) {
    if (hasInstalledWallet) {
      menus = [
        {
          text: (
            <div className='flex w-full items-center justify-between gap-4'>
              <span>Connect Wallet</span>
            </div>
          ),
          className: cx('gap-4'),
          icon: () => (
            <WalletIcon className='h-[36px] w-[36px] flex-shrink-0' />
          ),
          onClick: () => {
            const firstInstalledWallet = installedWallets[0]
            setPreferredWallet(firstInstalledWallet)
            setCurrentState('polkadot-connect-account')
            sendEvent('select_polkadot_wallet', { kind: 'mobile-wallet' })
          },
        },
      ]
    } else {
      // Currently, if the url contains encoded / (%252F) inside the link, it will not open the link, instead open search engine
      const urlToGo = urlJoin(
        getCurrentUrlOrigin(),
        env.NEXT_PUBLIC_BASE_PATH,
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
  }

  return (
    <div className='flex flex-col'>
      <MenuList className='pt-0' menus={menus} />
    </div>
  )
}
