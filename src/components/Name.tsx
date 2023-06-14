import useRandomColor from '@/hooks/useRandomColor'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'

type NameProps = {
  ownerId: string
  additionalText?: string
  className?: string
  color?: string
}

const Name = ({ ownerId, className, additionalText, color }: NameProps) => {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(ownerId)

  const { evmAddress, ensName } = accountData || {}
  const name = ensName ? ensName : generateRandomName(ownerId)

  const senderColor = useRandomColor(ownerId)
  const evmAddressColor = useRandomColor(evmAddress)

  if (!accountData && isLoading) {
    return (
      <div
        className={cx(
          'relative flex animate-pulse items-stretch gap-2.5 overflow-hidden outline-none'
        )}
      >
        <span className='my-1 mr-4 h-3 w-20 rounded-full bg-background-lighter font-medium' />
      </div>
    )
  }

  const textColor = evmAddress ? evmAddressColor : senderColor

  return (
    <span
      className={className ? className : 'mr-2 text-sm text-text-secondary'}
      style={{ color: color || textColor }}
    >
      {additionalText} {name}
    </span>
  )
}

export default Name
