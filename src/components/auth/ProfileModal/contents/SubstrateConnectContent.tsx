import MenuList from '@/components/MenuList'
import { WalletAccount } from '@/subsocial-query/subsocial/types'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ContentProps } from '../types'

export default function SubstrateConnectContent({ ...props }: ContentProps) {
  const supportedWallets: Wallet[] = getWallets()
  const [isWalletLoading, setIsWalletLoading] = useState<Set<string>>(new Set())

  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [accounts, setAccounts] = useState<WalletAccount[]>([])

  useEffect(() => {
    try {
      const unsub = selectedWallet?.subscribeAccounts((accounts) => {
        setAccounts(accounts ?? [])
      })
      return () => {
        if (typeof unsub === 'function') unsub()
      }
    } catch (err) {
      // Handle error. Refer to `libs/wallets/src/lib/errors`
    }
  }, [selectedWallet])

  return (
    <div className='flex flex-col'>
      {(() => {
        if (!selectedWallet)
          return (
            <MenuList
              className='pb-6 pt-0'
              menus={supportedWallets.map((wallet: Wallet) => ({
                text: wallet.title,
                disabled: isWalletLoading.has(wallet.title),
                icon: () => (
                  <Image
                    className='h-6 w-6'
                    width={24}
                    height={24}
                    src={wallet.logo.src}
                    alt={wallet.logo.alt}
                  />
                ),
                onClick: async () => {
                  try {
                    setIsWalletLoading(
                      (prev) => new Set(prev.add(wallet.title))
                    )
                    await wallet.enable('grill.chat')
                    setIsWalletLoading((prev) => {
                      const newSet = new Set(prev)
                      newSet.delete(wallet.title)
                      return newSet
                    })
                    setSelectedWallet(wallet)
                  } catch (err) {
                    // Handle error. Refer to `libs/wallets/src/lib/errors`
                  }
                },
              }))}
            />
          )

        if (accounts.length === 0) {
          return (
            <p className='p-6 pt-0'>
              No accounts found or the source is not allowed to interact with
              this extension. Please open your Polkadot extension and create a
              new account or give access to this site.
            </p>
          )
        }

        return null
      })()}
    </div>
  )
}

// {
//   return (
//     <button
//       key={wallet.extensionName}
//       onClick={}
//     >
//       Connect to {wallet.title}
//     </button>
//   )
// }
