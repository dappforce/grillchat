import Button from '@/components/Button'
import InfoPanel from '@/components/InfoPanel'
import Toast from '@/components/Toast'
import PolkadotConnectWalletContent from '@/components/auth/common/polkadot-connect/PolkadotConnectWalletContent'
import useAccountsFromPreferredWallet from '@/components/auth/common/polkadot-connect/hooks/useAccountsFromPreferredWallet'
import { PolkadotConnectSteps } from '@/components/auth/common/polkadot-connect/types'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import {
  enableWalletOnce,
  getMyMainAddress,
  useMyAccount,
  useMyMainAddress,
} from '@/stores/my-account'
import { WalletAccount } from '@/subsocial-query/subsocial/types'
import { Signer, convertAddressToSubsocialAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import toast from 'react-hot-toast'

const ConnectWalletContext = createContext<{
  requestWalletAccount: () => Promise<WalletAccount | null>
}>({
  requestWalletAccount: () => Promise.resolve(null),
})

export function ConnectWalletProvider({ children }: { children: ReactNode }) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const resolver = useRef<(() => void)[]>([])
  useEffect(() => {
    if (!isOpenModal) {
      resolver.current.forEach((resolve) => resolve())
      resolver.current = []
    }
  }, [isOpenModal])

  const requestWalletAccount = useCallback(async () => {
    const firstCheckAccounts = await enableWalletOnce()
    const found = firstCheckAccounts.find(
      (account) =>
        convertAddressToSubsocialAddress(account.address) ===
          getMyMainAddress() ?? ''
    )

    if (found) return { address: found.address, signer: found.signer as Signer }

    setIsOpenModal(true)
    const { getPromise, getResolver } = generateManuallyTriggeredPromise()
    resolver.current.push(getResolver())

    await getPromise()
    const accounts = await enableWalletOnce()
    const foundAcc = accounts.find(
      (account) =>
        convertAddressToSubsocialAddress(account.address) === getMyMainAddress()
    )
    return foundAcc
      ? { address: foundAcc.address, signer: foundAcc.signer as Signer }
      : null
  }, [])

  return (
    <>
      <ConnectWalletContext.Provider value={{ requestWalletAccount }}>
        {children}
      </ConnectWalletContext.Provider>
      <ConnectWalletModal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      />
    </>
  )
}

export function useConnectWallet() {
  return useContext(ConnectWalletContext)
}

function ConnectWalletModal({ ...props }: ModalFunctionalityProps) {
  const [, setModalState] = useState<PolkadotConnectSteps>('polkadot-connect')
  const preferredWallet = useMyAccount.use.preferredWallet()
  const myAddress = useMyMainAddress()
  const { accounts, isLoading } = useAccountsFromPreferredWallet(
    (err, preferredWallet) => {
      toast.custom((t) => (
        <Toast
          t={t}
          title={`Failed to get accounts from ${preferredWallet || 'wallet'}`}
          description={(err as any)?.message}
        />
      ))
    },
    props.isOpen
  )

  const isFound = accounts?.find(
    (account) => convertAddressToSubsocialAddress(account.address) === myAddress
  )

  return (
    <Modal
      {...props}
      title='Please choose the wallet containing your connected address'
      description='We need confirmation from your polkadot wallet to perform this action'
      contentClassName={cx('!px-0 !pb-0')}
      titleClassName={cx('px-6')}
      descriptionClassName={cx('px-6')}
    >
      <PolkadotConnectWalletContent
        setCurrentState={setModalState}
        closeModal={props.closeModal}
      />
      <div className='flex flex-col gap-4 px-6 pb-6'>
        {!isFound && (
          <InfoPanel variant='error'>
            We couldn&apos;t find your currently connected address in your{' '}
            {preferredWallet?.title ?? 'wallet'}. Please choose another wallet
            or connect your account to your wallet.
          </InfoPanel>
        )}
        <Button
          size='lg'
          disabled={!preferredWallet || !!(!isFound && preferredWallet)}
          isLoading={isLoading}
          onClick={() => props.closeModal()}
        >
          Choose this wallet
        </Button>
      </div>
    </Modal>
  )
}
