import EthIcon from '@/assets/icons/eth-dynamic-size.svg'
import KiltIcon from '@/assets/icons/kilt-dynamic-size.svg'
import KusamaIcon from '@/assets/icons/kusama-dynamic-size.svg'
import PolkadotIcon from '@/assets/icons/polkadot-dynamic-size.svg'
import SubsocialIcon from '@/assets/icons/subsocial-dynamic-size.svg'
import XLogoIcon from '@/assets/icons/x-logo-dynamic-size.svg'
import useAddressRandomSeed from '@/hooks/useAddressRandomSeed'
import useRandomColor from '@/hooks/useRandomColor'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { decodeProfileSource, ProfileSource } from '@/utils/profile'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps } from 'react'
import { HiArrowUpRight } from 'react-icons/hi2'
import { useInView } from 'react-intersection-observer'
import ChatModerateChip from './chats/ChatModerateChip'
import PopOver from './floating/PopOver'
import LinkText from './LinkText'
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
  [key in ProfileSource]?: {
    icon: any
    tooltip: string
    link: (name: string, address: string) => string
  }
} = {
  'kilt-w3n': {
    icon: KiltIcon,
    tooltip: 'Kilt W3Name',
    link: () => '',
  },
  ens: {
    icon: EthIcon,
    tooltip: 'ENS',
    link: (name) => `https://app.ens.domains/${name}`,
  },
  'kusama-identity': {
    icon: KusamaIcon,
    tooltip: 'Kusama Identity',
    link: (_, address) => `https://sub.id/${address}`,
  },
  'polkadot-identity': {
    icon: PolkadotIcon,
    tooltip: 'Polkadot Identity',
    link: (_, address) => `https://sub.id/${address}`,
  },
  'subsocial-username': {
    icon: SubsocialIcon,
    tooltip: 'Subsocial Username',
    link: (name) => `https://sub.id/${name}`,
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
  const sendEvent = useSendEvent()
  const { inView, ref } = useInView()

  const { isLoading, name, textColor, profileSource } = useName(
    address,
    forceProfileSource
  )
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    address ?? '',
    { enabled: inView && profileSource === 'subsocial-profile' }
  )

  let {
    icon: Icon,
    tooltip,
    link,
  } = profileSourceData[profileSource ?? ('' as ProfileSource)] || {}

  if (showOnlyCustomIdentityIcon && profileSource !== 'subsocial-profile') {
    Icon = undefined
    tooltip = ''
  }
  if (linkedIdentity && profileSource === 'subsocial-profile') {
    Icon = XLogoIcon
    tooltip = 'X Profile'
    link = () =>
      `https://twitter.com/intent/user?user_id=${linkedIdentity.externalId}`
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
        'relative top-px flex-shrink-0 text-[0.9em] text-text-muted',
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
        <LinkText
          href={link?.(name, address)}
          openInNewTab
          onClick={() => sendEvent('click_name_link')}
          variant='primary'
          className='flex items-center font-semibold outline-none'
        >
          <span>{tooltip}</span>
          <HiArrowUpRight />
        </LinkText>
      </PopOver>
    </div>
  )

  return (
    <span
      {...props}
      ref={ref}
      className={cx('flex items-center gap-1', className)}
      style={{ color: color || textColor }}
    >
      {profileSourceIconPosition === 'left' && iconElement}
      <span>
        {additionalText} {name}{' '}
      </span>
      {profileSourceIconPosition === 'right' && iconElement}
      {inView && (
        <ChatModerateChip
          className='relative top-px flex items-center'
          chatId={labelingData?.chatId ?? ''}
          address={address}
        />
      )}
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
  const randomSeed = useAddressRandomSeed(address)
  let name = generateRandomName(randomSeed)

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
