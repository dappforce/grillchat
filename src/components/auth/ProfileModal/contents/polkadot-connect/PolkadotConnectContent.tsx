import Button from '@/components/Button'
import Card from '@/components/Card'
import { CopyTextInline } from '@/components/CopyText'
import LinkText from '@/components/LinkText'
import MenuList from '@/components/MenuList'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { getWallets, Wallet } from '@talismn/connect-wallets'
import Image from 'next/image'
import { ContentProps } from '../../types'

export default function PolkadotConnectContent({
  setCurrentState,
}: ContentProps) {
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)

  const setPreferredWallet = useMyAccount((state) => state.setPreferredWallet)
  const supportedWallets: Wallet[] = getWallets()

  if (!parentProxyAddress) {
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

  return (
    <div className='px-6 pb-6'>
      <div>
        <Card className={cx('flex justify-between')}>
          <CopyTextInline
            text={truncateAddress(parentProxyAddress)}
            tooltip='Copy my Polkadot address'
            tooltipPlacement='top'
            textToCopy={parentProxyAddress}
            textClassName='font-mono'
          />
          <LinkText
            openInNewTab
            href={`https://sub.id/${parentProxyAddress}`}
            withArrow
          >
            Sub ID
          </LinkText>
        </Card>
        <Button
          onClick={() => setCurrentState('polkadot-connect-unlink')}
          className='mt-6 w-full border-red-500'
          variant='primaryOutline'
          size='lg'
        >
          Unlink Polkadot address
        </Button>
      </div>
    </div>
  )
}
