import MenuList from '@/components/MenuList'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { WalletName } from '@solana/wallet-adapter-base'
import {
  useWalletDisconnectButton,
  useWalletMultiButton,
} from '@solana/wallet-adapter-base-ui'
import { Wallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LoginModalContentProps } from '../../LoginModalContent'

function getShouldWalletDisabled(wallet: Wallet) {
  return {
    disabled: wallet.readyState.toString() !== 'Installed',
  }
}

export default function SolanaConnectWalletContent({
  setCurrentState,
}: LoginModalContentProps) {
  const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
    onSelectWallet(walletName: WalletName): void
    wallets: Wallet[]
  }> | null>(null)

  const sendEvent = useSendEvent()

  const { buttonState, onSelectWallet } = useWalletMultiButton({
    onSelectWallet: setWalletModalConfig,
  })

  const { onButtonClick } = useWalletDisconnectButton()

  useEffect(() => {
    if (!walletModalConfig) {
      onButtonClick?.()
    }
  }, [onButtonClick, walletModalConfig])

  const menu =
    walletModalConfig?.wallets.map((wallet) => ({
      text: (
        <div className='flex w-full items-center justify-between gap-4'>
          <span
            className={cx(
              getShouldWalletDisabled(wallet).disabled &&
                'opacity-30 dark:opacity-100 dark:brightness-50'
            )}
          >
            {wallet.adapter.name}
          </span>
        </div>
      ),
      icon: () => (
        <Image
          width={32}
          height={32}
          className='h-10 w-10 flex-shrink-0 object-contain'
          src={wallet.adapter.icon}
          alt={wallet.adapter.name}
        />
      ),
      className: cx(
        'gap-4',
        getShouldWalletDisabled(wallet).disabled &&
          'focus-visible:bg-transparent hover:bg-transparent cursor-default'
      ),
      onClick: () => {
        if (wallet.readyState.toString() !== 'Installed') return

        sendEvent('login_polkadot_wallet_clicked', {
          value: wallet.adapter.name,
        })

        setCurrentState('solana-connect-confirmation')
        sendEvent('select_solana_wallet', { kind: wallet.adapter.name })

        walletModalConfig.onSelectWallet(wallet.adapter.name)
        setWalletModalConfig(null)
      },
    })) || []

  useEffect(() => {
    if (buttonState === 'no-wallet') {
      onSelectWallet?.()
    }
  }, [buttonState, onSelectWallet])

  return (
    <div className='flex flex-col'>
      <MenuList className='pt-0' menus={menu} />
    </div>
  )
}
