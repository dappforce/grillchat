import MenuList from '@/components/MenuList'
import { useMyAccount } from '@/stores/my-account'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { ContentProps } from '../../types'

export default function PolkadotConnectContent({
  setCurrentState,
}: ContentProps) {
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const supportedWallets: Wallet[] = getWallets()

  return (
    <div className='flex flex-col'>
      <MenuList
        className='pb-6 pt-0'
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
          },
        }))}
      />
    </div>
  )
}
