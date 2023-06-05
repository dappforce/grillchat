import { getEvmAddressQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'

type NameProps = {
  ownerId: string
  senderColor: string
}

const Name = ({ ownerId, senderColor }: NameProps) => {
  const { data: accountData, isLoading } = getEvmAddressQuery.useQuery(ownerId)

  const { ensName } = accountData || {}
  const name = ensName ? ensName : generateRandomName(ownerId)

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
      className='mr-2 text-sm text-text-secondary'
      style={{ color: senderColor }}
    >
      {name}
    </span>
  )
}

export default Name
