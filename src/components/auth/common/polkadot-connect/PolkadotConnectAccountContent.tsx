import MenuList, { MenuListProps } from '@/components/MenuList'
import ScrollableContainer from '@/components/ScrollableContainer'
import { Skeleton } from '@/components/SkeletonFallback'
import Toast from '@/components/Toast'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { Signer, truncateAddress } from '@/utils/account'
import { toSubsocialAddress } from '@subsocial/utils'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import toast from 'react-hot-toast'
import useAccountsFromPreferredWallet from './hooks/useAccountsFromPreferredWallet'
import { PolkadotConnectContentProps } from './types'

const Identicon = dynamic(() => import('@polkadot/react-identicon'), {
  ssr: false,
})

export default function PolkadotConnectAccountContent({
  setCurrentState,
}: PolkadotConnectContentProps) {
  const sendEvent = useSendEvent()
  const connectWallet = useMyAccount((state) => state.connectWallet)
  const { accounts, isLoading } = useAccountsFromPreferredWallet(
    (err, preferredWallet) => {
      toast.custom((t) => (
        <Toast
          t={t}
          title={`Failed to get accounts from ${preferredWallet || 'wallet'}`}
          description={(err as any)?.message}
        />
      ))
      setCurrentState('polkadot-connect')
    }
  )

  const menus: MenuListProps['menus'] =
    accounts
      ?.map((account) => {
        const avatar = (account as any).avatar
        let address = ''
        try {
          address = toSubsocialAddress(account.address)!
        } catch {}
        if (!address) return null

        return {
          text: (
            <span className='flex flex-1 items-center justify-between gap-4'>
              <span>{account.name || account.address}</span>
              <span className='whitespace-nowrap font-mono text-text-muted'>
                {truncateAddress(toSubsocialAddress(account.address)!)}
              </span>
            </span>
          ),
          onClick: () => {
            if (!account.signer) return

            connectWallet(account.address, account.signer as Signer)
            sendEvent('select_polkadot_address')
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
      })
      .filter(Boolean) ?? []

  return (
    <div>
      {(() => {
        if (isLoading || !accounts) {
          return (
            <div className='flex flex-col pb-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div className='w-full px-7' key={i}>
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
            className='mb-3 max-h-96 scrollbar-track-background-light'
          >
            <MenuList className='py-0' menus={menus} />
          </ScrollableContainer>
        )
      })()}
    </div>
  )
}
