import useRandomColor from '@/hooks/useRandomColor'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  color?: string
}

const Name = ({
  address,
  className,
  additionalText,
  color,
  ...props
}: NameProps) => {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)
  const textColor = useRandomColor(address)

  const { ensName } = accountData || {}
  const name = ensName || generateRandomName(address)

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
      className={cx(className)}
      style={{ color: color || textColor }}
    >
      {additionalText} {name}
    </span>
  )
}

export default Name
