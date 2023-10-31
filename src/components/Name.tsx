import EthIcon from '@/assets/icons/eth-dynamic-size.svg'
import KiltIcon from '@/assets/icons/kilt-dynamic-size.svg'
import PolkadotIcon from '@/assets/icons/polkadot-dynamic-size.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { decodeProfileSource, ProfileSource } from '@/utils/profile'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import ChatModerateChip from './chats/ChatModerateChip'

export type ForceProfileSource = {
  profileSource?: ProfileSource
  content?: string
}

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showProfileSourceIcon?: boolean
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

  const { ensNames, evmAddress } = accountData || {}
  let name = profile?.profileSpace?.content?.name || generateRandomName(address)

  const userProfileSource = profile?.profileSpace?.content?.profileSource
  const { data: identities } = getIdentityQuery.useQuery(address ?? '', {
    enabled: !!address,
  })

  function getNameFromSource(profileSource?: ProfileSource, content?: string) {
    switch (profileSource) {
      case 'ens':
        if (ensNames?.includes(content ?? '')) return content
        return undefined
      case 'polkadot-identity':
        return identities?.polkadot
      case 'kilt-w3n':
        return identities?.kilt
      case 'subsocial-profile':
        return content || profile?.profileSpace?.content?.name
    }
  }

  let profileSource = forceProfileSource?.profileSource
  const forceName = getNameFromSource(
    profileSource,
    forceProfileSource?.content
  )
  if (forceName) name = forceName
  else {
    const { source, content } = decodeProfileSource(userProfileSource ?? '')
    const userProfileName = getNameFromSource(source, content)
    if (userProfileName) {
      name = userProfileName
      profileSource = source
    }
  }

  return {
    name,
    profileSource,
    accountData,
    profile,
    evmAddress,
    isLoading,
    textColor,
    ensNames,
  }
}

const Name = ({
  address,
  className,
  additionalText,
  color,
  labelingData,
  forceProfileSource,
  showProfileSourceIcon = true,
  ...props
}: NameProps) => {
  const { accountData, isLoading, name, textColor, profileSource } = useName(
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
      {showProfileSourceIcon &&
        profileSource &&
        profileSource !== 'subsocial-profile' && (
          <div className='relative top-0.5 mr-1 flex-shrink-0 text-text-muted'>
            {profileSource === 'ens' && <EthIcon />}
            {profileSource === 'kilt-w3n' && <KiltIcon />}
            {profileSource === 'polkadot-identity' && <PolkadotIcon />}
          </div>
        )}
      <span>
        {additionalText} {name}{' '}
      </span>
      <ChatModerateChip
        className='ml-1 flex items-center'
        chatId={labelingData?.chatId ?? ''}
        address={address}
      />
    </span>
  )
}

export default Name
