import useRandomColor from '@/hooks/useRandomColor'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'

type NameProps = {
  address: string
  additionalText?: string
  className?: string
}

const Name = ({ address, className, additionalText }: NameProps) => {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)

  const { evmAddress, ensName } = accountData || {}
  const name = ensName ? ensName : generateRandomName(address)

  const usedAddress = evmAddress || address
  const senderColor = useRandomColor(usedAddress)

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

  return (
    <span
      className={className ? className : 'mr-2 text-sm text-text-secondary'}
      style={{ color: senderColor }}
    >
      {additionalText} {name}
    </span>
  )
}

export default Name
