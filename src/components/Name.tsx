import EthIcon from '@/assets/icons/eth-medium.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { generateRandomName } from '@/utils/random-name'
import { SpaceContent } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import ChatModerateChip from './chats/ChatModerateChip'

export type ForceProfileSource = {
  profileSource?: SpaceContent['profileSource']
  name?: string
}

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showEthIcon?: boolean
  color?: string
  labelingData?: { chatId: string }
  forceProfileSource?: ForceProfileSource
}

export function useName(
  address: string,
  forceProfileSource?: ForceProfileSource
) {
  const { data: accountData, isLoading } = getAccountDataQuery.useQuery(address)
  const { data: profile } = getProfileQuery.useQuery(address)
  const textColor = useRandomColor(address, { isAddress: true })

  const { ensName, evmAddress } = accountData || {}
  let name =
    ensName ||
    profile?.profileSpace?.content?.name ||
    generateRandomName(address)

  const userProfileSource = profile?.profileSpace?.content?.profileSource

  function getNameFromSource(profileSource?: SpaceContent['profileSource']) {
    switch (profileSource) {
      case 'ens':
        return ensName
      case 'subsocial-profile':
        return profile?.profileSpace?.content?.name
    }
  }

  const forceName = getNameFromSource(forceProfileSource?.profileSource)
  if (forceName) name = forceName
  else {
    const userProfileName = getNameFromSource(userProfileSource)
    if (userProfileName) name = userProfileName
  }

  return {
    name: forceProfileSource?.name || name,
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
  forceProfileSource,
  ...props
}: NameProps) => {
  const { accountData, evmAddress, isLoading, name, textColor } = useName(
    address,
    forceProfileSource
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
