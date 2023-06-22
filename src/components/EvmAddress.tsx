import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { HiArrowUpRight } from 'react-icons/hi2'
import { CopyTextInline } from './CopyText'
import LinkText from './LinkText'

export type EvmAddressProps = ComponentProps<'div'> & {
  evmAddress: string
}

export default function EvmAddress({ evmAddress, ...props }: EvmAddressProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex justify-between rounded-2xl bg-background-lighter p-4',
        props.className
      )}
    >
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
        variant='primary'
      >
        <span className='flex items-center'>
          Etherscan <HiArrowUpRight className='ml-2' />
        </span>
      </LinkText>
    </div>
  )
}
