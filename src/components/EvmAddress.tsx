import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import Card, { CardProps } from './Card'
import { CopyTextInline } from './CopyText'
import LinkText from './LinkText'

export type EvmAddressProps = CardProps & {
  evmAddress: string
}

export default function EvmAddress({ evmAddress, ...props }: EvmAddressProps) {
  return (
    <Card {...props} className={cx('flex justify-between', props.className)}>
      <CopyTextInline
        text={truncateAddress(evmAddress)}
        tooltip='Copy my EVM address'
        tooltipPlacement='top'
        textToCopy={evmAddress}
        textClassName='font-mono'
      />
      <LinkText
        openInNewTab
        href={`https://etherscan.io/address/${evmAddress}`}
        withArrow
      >
        Etherscan
      </LinkText>
    </Card>
  )
}
