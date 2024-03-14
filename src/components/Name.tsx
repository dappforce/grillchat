import useAddressIdentityId from '@/hooks/useAddressIdentityId'
import useRandomColor from '@/hooks/useRandomColor'
import { getIdentityQuery, getProfileQuery } from '@/services/api/query'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useSendEvent } from '@/stores/analytics'
import { getCurrentPageChatId } from '@/utils/chat'
import { cx } from '@/utils/class-names'
import { getUserProfileLink } from '@/utils/links'
import {
  ProfileSource,
  ProfileSourceIncludingOffchain,
  decodeProfileSource,
  profileSourceData,
} from '@/utils/profile'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps, ComponentPropsWithoutRef, forwardRef } from 'react'
import { useInView } from 'react-intersection-observer'
import LinkText from './LinkText'
import { ForceProfileSource } from './ProfilePreview'
import ChatModerateChip from './chats/ChatModerateChip'
import PopOver from './floating/PopOver'
import CustomLink from './referral/CustomLink'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  showOnlyCustomIdentityIcon?: boolean
  profileSourceIconClassName?: string
  showModeratorChip?: boolean
  profileSourceIconPosition?: 'none' | 'left' | 'right'
  color?: string
  labelingData?: { chatId: string }
  forceProfileSource?: ForceProfileSource
  clipText?: boolean
  asLink?: boolean
}

export default function Name({
  address,
  className,
  additionalText,
  showOnlyCustomIdentityIcon,
  profileSourceIconClassName,
  color,
  labelingData,
  showModeratorChip,
  forceProfileSource,
  clipText,
  profileSourceIconPosition = 'right',
  asLink,
  ...props
}: NameProps) {
  const sendEvent = useSendEvent()
  const { inView, ref } = useInView({ triggerOnce: true })

  const { isLoading, name, textColor, profileSource, profile } = useName(
    address,
    forceProfileSource
  )
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    address ?? '',
    { enabled: inView && profileSource === 'subsocial-profile' }
  )

  let usedProfileSource: ProfileSourceIncludingOffchain | undefined =
    profileSource
  let usedTooltipLinkId = name
  if (profileSource === 'subsocial-profile') {
    if (linkedIdentity?.provider === IdentityProvider.Twitter) {
      usedProfileSource = 'x'
      usedTooltipLinkId = linkedIdentity.externalId
    } else if (linkedIdentity?.provider === IdentityProvider.Google) {
      usedProfileSource = 'google'
      usedTooltipLinkId = linkedIdentity.externalId
    }
  }

  let {
    icon: Icon,
    tooltip,
    link,
  } = profileSourceData[usedProfileSource || ('' as ProfileSource)] || {}

  if (showOnlyCustomIdentityIcon && profileSource !== 'subsocial-profile') {
    Icon = undefined
    tooltip = ''
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
        clipText && 'overflow-hidden',
        profileSourceIconClassName
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <PopOver
        trigger={
          <LinkText
            href={link?.(usedTooltipLinkId, address)}
            openInNewTab
            onClick={() =>
              sendEvent('idenity_link_clicked', {
                eventSource: getCurrentPageChatId(),
              })
            }
          >
            <Icon />
          </LinkText>
        }
        panelSize='sm'
        yOffset={6}
        placement='top'
        triggerOnHover
      >
        <span>{tooltip}</span>
      </PopOver>
    </div>
  )

  const profileLink = asLink
    ? getUserProfileLink(profile?.profileSpace?.id)
    : undefined

  return (
    <LinkOrText
      {...props}
      href={profileLink}
      ref={ref}
      className={cx(
        'flex items-center gap-1',
        clipText && 'overflow-hidden',
        className
      )}
      style={{ color: color || textColor }}
    >
      {profileSourceIconPosition === 'left' && iconElement}
      <span
        className={cx(
          clipText && 'overflow-hidden text-ellipsis whitespace-nowrap'
        )}
      >
        {additionalText} {name}{' '}
      </span>
      {profileSourceIconPosition === 'right' && iconElement}
      {inView && showModeratorChip && (
        <ChatModerateChip
          className='relative top-px flex items-center'
          chatId={labelingData?.chatId ?? ''}
          address={address}
        />
      )}
    </LinkOrText>
  )
}

const LinkOrText = forwardRef<
  any,
  ComponentPropsWithoutRef<'span'> & { href?: string }
>(({ href, ...props }, ref) => {
  if (href) {
    return (
      <PopOver
        trigger={
          <CustomLink href={href} forceHardNavigation {...props} ref={ref} />
        }
        panelSize='sm'
        triggerOnHover
        placement='top'
        yOffset={6}
      >
        <span>Open profile</span>
      </PopOver>
    )
  }
  return <div {...props} ref={ref} />
})
LinkOrText.displayName = 'LinkOrText'

export function useName(
  address: string,
  forceProfileSource?: ForceProfileSource
) {
  const { data: profile, isLoading: isLoadingProfile } =
    getProfileQuery.useQuery(address)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
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
  const randomSeed = useAddressIdentityId(address)
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
    isLoading: isLoadingProfile || isLoadingIdentities,
    textColor,
    ensNames,
  }
}
