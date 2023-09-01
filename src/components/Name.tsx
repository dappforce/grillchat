import EthIcon from '@/assets/icons/eth-medium.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/mainnet-squid/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showEthIcon?: boolean
  color?: string
}

export function useName(address: string) {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const textColor = useRandomColor(address, { isAddress: true })

  const { ensName, evmAddress } = accountData || {}
  const name =
    ensName || profile?.profileSpace?.name || generateRandomName(address)

  return { name, accountData, evmAddress, isLoading, textColor }
}

const Name = ({
  address,
  className,
  additionalText,
  showEthIcon = true,
  color,
  ...props
}: NameProps) => {
  const { accountData, evmAddress, isLoading, name, textColor } =
    useName(address)

  if (!accountData && isLoading) {
    return (
      <span
        {...props}
        className={cx(
          'relative flex animate-pulse items-stretch gap-2.5 overflow-hidden outline-none',
          className
        )}
      >
        <span className='my-1 mr-4 h-3 w-20 rounded-full bg-background-lighter font-medium' />
      </span>
    )
  }

  return (
    <span
      {...props}
      className={cx(className, 'flex items-center')}
      style={{ color: color || textColor }}
    >
      {evmAddress && showEthIcon && <EthIcon className='mr-2 flex-shrink-0' />}
      {additionalText} {name}
    </span>
  )
}

export default Name
