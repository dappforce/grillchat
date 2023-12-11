import PolkadotConnectWalletContent from '@/components/auth/common/polkadot-connect/PolkadotConnectWalletContent'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { CopyTextInline } from '@/components/CopyText'
import PopOver from '@/components/floating/PopOver'
import LinkText from '@/components/LinkText'
import { useSendEvent } from '@/stores/analytics'
import { useMyAccount } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import useCanUnlinkAddress from '../../hooks/useCanUnlinkAddress'
import { ContentProps } from '../../types'

export default function PolkadotConnectContent({
  setCurrentState,
}: ContentProps) {
  const sendEvent = useSendEvent()
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)
  const canUnlinkAddress = useCanUnlinkAddress()

  if (!parentProxyAddress) {
    return <PolkadotConnectWalletContent setCurrentState={setCurrentState} />
  }

  const unlinkButton = (
    <Button
      onClick={() => {
        setCurrentState('polkadot-connect-unlink')
        sendEvent('polkadot_address_unlinked')
      }}
      disabled={!canUnlinkAddress}
      className='mt-6 w-full border-red-500'
      variant='primaryOutline'
      size='lg'
    >
      Unlink Polkadot address
    </Button>
  )

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
        {!canUnlinkAddress ? (
          <PopOver
            yOffset={8}
            trigger={<div className='w-full'>{unlinkButton}</div>}
            triggerOnHover
          >
            <p>You need at least 1 identity/account linked to your account</p>
          </PopOver>
        ) : (
          unlinkButton
        )}
      </div>
    </div>
  )
}
