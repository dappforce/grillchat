import PolkadotConnectWalletContent from '@/components/auth/common/polkadot-connect/PolkadotConnectWalletContent'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { CopyTextInline } from '@/components/CopyText'
import LinkText from '@/components/LinkText'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ContentProps } from '../../types'

export default function PolkadotConnectContent({
  setCurrentState,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)

  if (!parentProxyAddress) {
    return <PolkadotConnectWalletContent setCurrentState={setCurrentState} />
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
          onClick={() => {
            setCurrentState('polkadot-connect-unlink')
            sendEvent('polkadot_address_unlinked')
          }}
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
