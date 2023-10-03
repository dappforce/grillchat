import Button from '@/components/Button'
import MenuList from '@/components/MenuList'
import Modal from '@/components/modals/Modal'
import ProfilePreview from '@/components/ProfilePreview'
import Spinner from '@/components/Spinner'
import Toast from '@/components/Toast'
import { AddProxyWrapper } from '@/services/subsocial/proxy/mutation'
import { useMyAccount } from '@/stores/my-account'
import { Signer } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getWallets, Wallet, WalletAccount } from '@talismn/connect-wallets'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function SubstrateConnectContent() {
  const connectWallet = useMyAccount((state) => state.connectWallet)

  const supportedWallets: Wallet[] = getWallets()
  const [isWalletLoading, setIsWalletLoading] = useState<Set<string>>(new Set())

  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [accounts, setAccounts] = useState<WalletAccount[] | null>(null)

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<{
    address: string
    signer: Signer
  } | null>(null)

  useEffect(() => {
    if (!selectedWallet) return

    try {
      const unsub = selectedWallet.subscribeAccounts((accounts) => {
        setAccounts(accounts ?? [])
      })
      return () => {
        if (typeof unsub === 'function') unsub()
      }
    } catch (err) {
      toast.custom((t) => (
        <Toast
          t={t}
          title={`Failed to get accounts from ${selectedWallet.title}`}
          description={(err as any)?.message}
        />
      ))
    }
  }, [selectedWallet])

  const closeAccountSelectorModal = () => {
    setSelectedWallet(null)
  }

  return (
    <>
      <div className='flex flex-col'>
        <MenuList
          className='pb-6 pt-0'
          menus={supportedWallets.map((wallet: Wallet) => ({
            text: wallet.title,
            disabled: isWalletLoading.has(wallet.title),
            icon: () => (
              <Image
                width={32}
                height={32}
                className='h-8 w-8'
                src={wallet.logo.src}
                alt={wallet.logo.alt}
              />
            ),
            onClick: async () => {
              try {
                setIsWalletLoading((prev) => new Set(prev.add(wallet.title)))
                await wallet.enable('grill.chat')
                setIsWalletLoading((prev) => {
                  const newSet = new Set(prev)
                  newSet.delete(wallet.title)
                  return newSet
                })

                setSelectedWallet(wallet)
                setAccounts(null)
              } catch (err) {
                toast.custom((t) => (
                  <Toast
                    t={t}
                    title={`Failed to enable to ${wallet.title}`}
                    description={(err as any)?.message}
                  />
                ))
              }
            },
          }))}
        />
      </div>
      <Modal
        isOpen={!!selectedWallet && !isAccountModalOpen}
        closeModal={closeAccountSelectorModal}
        onBackClick={closeAccountSelectorModal}
        contentClassName='!px-0'
        titleClassName='px-6'
        descriptionClassName='px-6'
        title='Select an account'
        description='Select an account to connect to Grill.chat.'
      >
        {(() => {
          if (accounts === null) {
            return <Spinner />
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
            <MenuList
              className='py-0'
              menus={accounts.map((account) => {
                const avatar = (account as any).avatar
                return {
                  text: account.name || account.address,
                  onClick: () => {
                    if (!account.signer) return
                    setSelectedAccount({
                      address: account.address,
                      signer: account.signer as Signer,
                    })
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
                    ) : null,
                }
              })}
            />
          )
        })()}
      </Modal>
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
              address={selectedAccount?.address ?? ''}
              avatarClassName={cx('h-16 w-16')}
            />
          </div>
          <div className='flex flex-col gap-4'>
            <AddProxyWrapper>
              {({ isLoading, mutateAsync: addProxy }) => {
                return (
                  <Button
                    size='lg'
                    onClick={() => {
                      const { address, signer } = selectedAccount ?? {}
                      if (address && signer) {
                        connectWallet(address, signer)
                        addProxy(null)
                      }
                    }}
                    isLoading={isLoading}
                  >
                    Use this account
                  </Button>
                )
              }}
            </AddProxyWrapper>
            <Button size='lg' variant='primaryOutline'>
              Select another account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
