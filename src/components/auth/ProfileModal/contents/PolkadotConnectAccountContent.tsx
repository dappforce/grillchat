import MenuList from '@/components/MenuList'
import ScrollableContainer from '@/components/ScrollableContainer'
import { Skeleton } from '@/components/SkeletonFallback'
import Toast from '@/components/Toast'
import { useMyAccount } from '@/stores/my-account'
import { Signer, truncateAddress } from '@/utils/account'
import { toSubsocialAddress } from '@subsocial/utils'
import { WalletAccount } from '@talismn/connect-wallets'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { ContentProps } from '../types'

const Identicon = dynamic(() => import('@polkadot/react-identicon'), {
  ssr: false,
})

export default function PolkadotConnectAccountContent({
  setCurrentState,
}: ContentProps) {
  const preferredWallet = useMyAccount((state) => state.preferredWallet)
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const connectWallet = useMyAccount((state) => state.connectWallet)

  const [accounts, setAccounts] = useState<WalletAccount[] | null>(null)

  useEffect(() => {
    async function enableWallet() {
      if (!preferredWallet) return
      try {
        await preferredWallet.enable('grill.chat')
        const unsub = preferredWallet.subscribeAccounts((accounts) => {
          setAccounts(accounts ?? [])
        })
        return unsub
      } catch (err) {
        toast.custom((t) => (
          <Toast
            t={t}
            title={`Failed to get accounts from ${preferredWallet.title}`}
            description={(err as any)?.message}
          />
        ))
        setPreferredWallet(null)
        setCurrentState('polkadot-connect-wallet')
      }
    }

    const unsub = enableWallet()
    return () => {
      unsub.then((unsub) => {
        if (typeof unsub === 'function') unsub()
      })
    }
  }, [preferredWallet, setCurrentState, setPreferredWallet])

  return (
    <div>
      {(() => {
        if (accounts === null) {
          return (
            <div className='flex flex-col gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div className='w-full px-7 pb-3' key={i}>
                  <div className='flex w-full items-center gap-6 py-3'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                    <div className='flex flex-1 justify-between'>
                      <Skeleton className='w-32' />
                      <Skeleton className='w-24' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
        if (accounts.length === 0) {
          return (
            <p className='p-6 pt-0'>
              No accounts found or the source is not allowed to interact with
              this extension. Please open your Polkadot extension and create a
              new account or give access to this site.
            </p>
          )
        }

        return (
          <ScrollableContainer
            as='div'
            className='mb-4 max-h-96 scrollbar-track-background-light'
          >
            <MenuList
              className='py-0'
              menus={accounts.map((account) => {
                const avatar = (account as any).avatar
                return {
                  text: (
                    <span className='flex flex-1 items-center justify-between'>
                      <span>{account.name || account.address}</span>
                      <span className='font-mono text-text-muted'>
                        {truncateAddress(toSubsocialAddress(account.address)!)}
                      </span>
                    </span>
                  ),
                  onClick: () => {
                    if (!account.signer) return

                    connectWallet(account.address, account.signer as Signer)
                    setCurrentState('polkadot-connect-confirmation')
                  },
                  icon: () =>
                    avatar ? (
                      <Image
                        alt='account'
                        src={avatar}
                        width={32}
                        height={32}
                        className='h-8 w-8'
                      />
                    ) : (
                      <Identicon
                        value={account.address}
                        theme='polkadot'
                        size={32}
                        className='h-8 w-8'
                      />
                    ),
                }
              })}
            />
          </ScrollableContainer>
        )
      })()}
    </div>
  )
}
