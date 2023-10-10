import Button from '@/components/Button'
import MenuList from '@/components/MenuList'
import Modal from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import ScrollableContainer from '@/components/ScrollableContainer'
import { Skeleton } from '@/components/SkeletonFallback'
import Toast from '@/components/Toast'
import { AddProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { useMyAccount } from '@/stores/my-account'
import { Signer, truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
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
  const saveConnectedWallet = useMyAccount((state) => state.saveConnectedWallet)
  const connectWallet = useMyAccount((state) => state.connectWallet)

  const isLoadingEnergy = useMyAccount(
    (state) => state.connectedWallet?.energy === null
  )
  const preferredWallet = useMyAccount((state) => state.preferredWallet)
  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)

  const [accounts, setAccounts] = useState<WalletAccount[] | null>(null)

  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(
    null
  )
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

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
        setCurrentState('polkadot-connect')
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
    <>
      <div>
        {(() => {
          if (accounts === null) {
            return (
              <div className='w-full px-7 pb-3'>
                <div className='flex w-full items-center gap-6 py-3'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <div className='flex flex-1 justify-between'>
                    <Skeleton className='w-32' />
                    <Skeleton className='w-24' />
                  </div>
                </div>
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
                          {truncateAddress(
                            toSubsocialAddress(account.address)!
                          )}
                        </span>
                      </span>
                    ),
                    onClick: () => {
                      if (!account.signer) return

                      setSelectedAccount(account)
                      setIsAccountModalOpen(true)
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

      <Modal
        isOpen={!!isAccountModalOpen}
        closeModal={() => setIsAccountModalOpen(false)}
        onBackClick={() => setIsAccountModalOpen(false)}
        title='Use Grill.chat from this account?'
        description='All the messages you will make will be created from this account.'
      >
        <div className='mt-2 flex flex-col gap-6'>
          <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
            <ProfilePreview
              address={toSubsocialAddress(selectedAccount?.address) ?? ''}
              avatarClassName={cx('h-16 w-16')}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <AddProxyWrapper
              loadingUntilTxSuccess
              config={{
                txCallbacks: {
                  onSuccess: () => {
                    saveConnectedWallet()
                    setCurrentState('account-settings')
                  },
                },
              }}
            >
              {({ isLoading, mutateAsync: addProxy }) => {
                return (
                  <Button
                    size='lg'
                    onClick={async () => {
                      const address = toSubsocialAddress(
                        selectedAccount?.address
                      )
                      const signer = selectedAccount?.signer as Signer
                      if (address && signer) {
                        connectWallet(address, signer)
                        addProxy(null)
                      }
                    }}
                    isLoading={isLoading || isLoadingEnergy}
                  >
                    Use this account
                  </Button>
                )
              }}
            </AddProxyWrapper>
            <Button
              size='lg'
              variant='primaryOutline'
              onClick={() => setIsAccountModalOpen(false)}
            >
              Select another account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
