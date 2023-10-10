import MenuList from '@/components/MenuList'
import { getProxiesQuery } from '@/services/subsocial/proxy/query'
import { useMyAccount } from '@/stores/my-account'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { useEffect } from 'react'
import { ContentProps } from '../types'

export default function PolkadotConnectContent({
  setCurrentState,
}: ContentProps) {
  const preferredWallet = useMyAccount((state) => state.preferredWallet)
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)

  useEffect(() => {
    if (preferredWallet) setCurrentState('polkadot-connect-account')
  }, [preferredWallet, setCurrentState])

  const address = useMyAccount((state) => state.address)
  const connectedWallet = useMyAccount((state) => state.connectedWallet)
  const { data: proxies } = getProxiesQuery.useQuery(
    { address: connectedWallet?.address ?? '' },
    { enabled: !!connectedWallet?.address }
  )

  const supportedWallets: Wallet[] = getWallets()

  if (proxies?.includes(address ?? '')) {
    return (
      <div className='p-6'>
        <p className='text-center'>Your proxy are active!</p>
      </div>
    )
  }

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
