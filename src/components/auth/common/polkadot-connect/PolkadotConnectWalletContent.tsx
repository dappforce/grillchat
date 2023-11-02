import MenuList from '@/components/MenuList'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { PolkadotConnectContentProps } from './types'

export default function PolkadotConnectWalletContent({
  setCurrentState,
}: PolkadotConnectContentProps) {
  const sendEvent = useSendEvent()
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const supportedWallets: Wallet[] = getWallets()

  return (
    <div className='flex flex-col'>
      <MenuList
        className='pt-0'
        menus={supportedWallets.map((wallet: Wallet) => ({
          text: wallet.title,
          className: 'gap-4',
          icon: () => (
            <Image
              width={32}
              height={32}
              className='h-10 w-10'
              src={wallet.logo.src}
              alt={wallet.logo.alt}
            />
          ),
          onClick: () => {
            setPreferredWallet(wallet)
            setCurrentState('polkadot-connect-account')
            sendEvent('select_polkadot_wallet', { kind: wallet.title })
          },
        }))}
      />
    </div>
  )
}
