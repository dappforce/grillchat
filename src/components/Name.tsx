import EthIcon from '@/assets/icons/eth-medium.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import ChatModerateChip from './chats/ChatModerateChip'

export type ForceDefaultProfile = {
  defaultProfile?: string
  name?: string
}

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showEthIcon?: boolean
  color?: string
  labelingData?: { chatId: string }
  forceDefaultProfile?: ForceDefaultProfile
}

export function useName(
  address: string,
  forceDefaultProfile?: ForceDefaultProfile
) {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const textColor = useRandomColor(address, { isAddress: true })

  const { ensName, evmAddress } = accountData || {}
  let name =
    ensName ||
    profile?.profileSpace?.content?.name ||
    generateRandomName(address)

  const defaultProfile =
    forceDefaultProfile?.defaultProfile ||
    profile?.profileSpace?.content?.defaultProfile
  if (defaultProfile) {
    switch (defaultProfile) {
      case 'evm':
        name = ensName || name
        break
      case 'custom':
        name = profile?.profileSpace?.content?.name || name
        break
    }
  }

  return {
    name: forceDefaultProfile?.name || name,
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
  forceDefaultProfile,
  ...props
}: NameProps) => {
  const { accountData, evmAddress, isLoading, name, textColor } = useName(
    address,
    forceDefaultProfile
  )

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
