import EthIcon from '@/assets/icons/eth-medium.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import ChatModerateChip from './chats/ChatModerateChip'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showEthIcon?: boolean
  color?: string
  labelingData?: { chatId: string }
}

export function useName(address: string) {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const textColor = useRandomColor(address, { isAddress: true })

  const { ensName, evmAddress } = accountData || {}
  const name =
    ensName || profile?.profileSpace?.name || generateRandomName(address)

  return {
    name,
    accountData,
    profile,
    evmAddress,
    isLoading,
    textColor,
    ensName,
  }
}

const Name = ({
  address,
  className,
  additionalText,
  showEthIcon = true,
  color,
  labelingData,
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
      {evmAddress && showEthIcon && (
        <EthIcon className='mr-1 flex-shrink-0 text-text-muted' />
      )}
      {additionalText} {name}{' '}
      <ChatModerateChip
        className='ml-1 flex items-center'
        chatId={labelingData?.chatId ?? ''}
        address={address}
      />
    </span>
  )
}

export default Name
