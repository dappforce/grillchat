import useRandomColor from '@/hooks/useRandomColor'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
}

const Name = ({ address, additionalText, ...props }: NameProps) => {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)

  const { evmAddress, ensName } = accountData || {}
  const name = ensName || generateRandomName(address)

  const usedAddress = evmAddress || address
  const textColor = useRandomColor(usedAddress)

  if (!accountData && isLoading) {
    return (
      <span
        {...props}
        className={cx(
          'relative flex animate-pulse items-stretch gap-2.5 overflow-hidden outline-none',
          props.className
        )}
      >
        <span className='my-1 mr-4 h-3 w-20 rounded-full bg-background-lighter font-medium' />
      </span>
    )
  }

  return (
    <span
      {...props}
      className={cx(props.className)}
      style={{ color: textColor }}
    >
      {additionalText} {name}
    </span>
  )
}

export default Name
