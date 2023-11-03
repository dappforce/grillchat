import SubwalletIcon from '@/assets/icons/subwallet.png'
import Button from '@/components/Button'
import MenuList, { MenuListProps } from '@/components/MenuList'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { FiDownload } from 'react-icons/fi'
import { PolkadotConnectContentProps } from './types'

export default function PolkadotConnectWalletContent({
  setCurrentState,
}: PolkadotConnectContentProps) {
  const sendEvent = useSendEvent()
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const supportedWallets: Wallet[] = getWallets()

  supportedWallets.sort((a, b) => {
    return !a.installed && b.installed ? 1 : -1
  })
  const menus: MenuListProps['menus'] = supportedWallets.map(
    (wallet: Wallet) => ({
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
    })
  )

  return (
    <div className='flex flex-col'>
      <MenuList className='pt-0' menus={menus} />
    </div>
  )
}
