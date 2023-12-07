import EthIcon from '@/assets/icons/eth-dynamic-size.svg'
import KiltIcon from '@/assets/icons/kilt-dynamic-size.svg'
import KusamaIcon from '@/assets/icons/kusama-dynamic-size.svg'
import PolkadotIcon from '@/assets/icons/polkadot-dynamic-size.svg'
import SubsocialIcon from '@/assets/icons/subsocial-dynamic-size.svg'
import XLogoIcon from '@/assets/icons/x-logo-dynamic-size.svg'
import useRandomColor from '@/hooks/useRandomColor'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { decodeProfileSource, ProfileSource } from '@/utils/profile'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import ChatModerateChip from './chats/ChatModerateChip'
import PopOver from './floating/PopOver'
import { ForceProfileSource } from './ProfilePreview'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showOnlyCustomIdentityIcon?: boolean
  profileSourceIconClassName?: string
  profileSourceIconPosition?: 'none' | 'left' | 'right'
  color?: string
  labelingData?: { chatId: string }
  forceProfileSource?: ForceProfileSource
}

const profileSourceData: {
  [key in ProfileSource]?: { icon: any; tooltip: string }
} = {
  'kilt-w3n': {
    icon: KiltIcon,
    tooltip: 'Kilt W3Name',
  },
  ens: {
    icon: EthIcon,
    tooltip: 'ENS',
  },
  'kusama-identity': {
    icon: KusamaIcon,
    tooltip: 'Kusama Identity',
  },
  'polkadot-identity': {
    icon: PolkadotIcon,
    tooltip: 'Polkadot Identity',
  },
  'subsocial-username': {
    icon: SubsocialIcon,
    tooltip: 'Subsocial Username',
  },
}

export default function Name({
  address,
  className,
  additionalText,
  showOnlyCustomIdentityIcon,
  profileSourceIconClassName,
  color,
  labelingData,
  forceProfileSource,
  profileSourceIconPosition = 'right',
  ...props
}: NameProps) {
  const { isLoading, name, textColor, profileSource } = useName(
    address,
    forceProfileSource
  )
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    address ?? ''
  )

  let { icon: Icon, tooltip } =
    profileSourceData[profileSource ?? ('' as ProfileSource)] || {}

  if (showOnlyCustomIdentityIcon && profileSource !== 'subsocial-profile') {
    Icon = undefined
    tooltip = ''
  }
  if (linkedIdentity && profileSource === 'subsocial-profile') {
    Icon = XLogoIcon
    tooltip = 'X Profile'
  }

  if (isLoading) {
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

  const iconElement = Icon && (
    <div
      className={cx(
        'relative top-px flex-shrink-0 text-text-muted',
        profileSourceIconClassName
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <PopOver
        trigger={<Icon />}
        panelSize='sm'
        yOffset={4}
        placement='top'
        triggerOnHover
      >
        <p>{tooltip}</p>
      </PopOver>
    </div>
  )

  return (
    <span
      {...props}
      className={cx('flex items-center gap-1', className)}
      style={{ color: color || textColor }}
    >
      {profileSourceIconPosition === 'left' && iconElement}
      <span>
        {additionalText} {name}{' '}
      </span>
      {profileSourceIconPosition === 'right' && iconElement}
      <ChatModerateChip
        className='relative top-px flex items-center'
        chatId={labelingData?.chatId ?? ''}
        address={address}
      />
    </span>
  )
}

export function useName(
  address: string,
  forceProfileSource?: ForceProfileSource
) {
  const { data: profile, isLoading: isLoadingProfile } =
    getProfileQuery.useQuery(address)
  const { data: accountData, isLoading: isLoadingEvm } =
    getAccountDataQuery.useQuery(address)
  const textColor = useRandomColor(address, { isAddress: true })

  const userProfileSource = profile?.profileSpace?.content?.profileSource

  const { source } = decodeProfileSource(userProfileSource)
  const identitiesNeededInSources: ProfileSource[] = [
    'kilt-w3n',
    'kusama-identity',
    'polkadot-identity',
    'subsocial-username',
  ]
  const isIdentitiesNeeded = identitiesNeededInSources.includes(
    forceProfileSource?.profileSource || source
  )
  const { data: identities, isFetching: isFetchingIdentities } =
    getIdentityQuery.useQuery(address ?? '', {
      enabled: isIdentitiesNeeded,
    })
  const isLoadingIdentities = isFetchingIdentities && isIdentitiesNeeded

  const { ensNames, evmAddress } = accountData || {}
  let name = generateRandomName(address)

  function getNameFromSource(profileSource?: ProfileSource, content?: string) {
    switch (profileSource) {
      case 'ens':
        if (ensNames?.includes(content ?? '')) return content
        return undefined
      case 'polkadot-identity':
        return identities?.polkadot
      case 'kusama-identity':
        return identities?.kusama
      case 'kilt-w3n':
        return identities?.kilt
      case 'subsocial-username':
        if (identities?.subsocial?.includes(content ?? '')) return content
        return undefined
      case 'subsocial-profile':
        return content || profile?.profileSpace?.content?.name
    }
  }

  let profileSource = forceProfileSource?.profileSource
  const forceName = getNameFromSource(
    profileSource,
    forceProfileSource?.content?.name
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
    isLoading: isLoadingEvm || isLoadingProfile || isLoadingIdentities,
    textColor,
    ensNames,
  }
}
