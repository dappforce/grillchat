import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/api/query'
import { getLinkedIdentityFromMainAddressQuery } from '@/services/datahub/identity/query'
import { useSendEvent } from '@/stores/analytics'
import { getCurrentPageChatId } from '@/utils/chat'
import { cx } from '@/utils/class-names'
import { getUserProfileLink } from '@/utils/links'
import { profileSourceData } from '@/utils/profile'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps, ComponentPropsWithoutRef, forwardRef } from 'react'
import { useInView } from 'react-intersection-observer'
import LinkText from './LinkText'
import ChatModerateChip from './chats/ChatModerateChip'
import PopOver from './floating/PopOver'
import CustomLink from './referral/CustomLink'

export type NameProps = ComponentProps<'span'> & {
  address: string
  additionalText?: string
  className?: string
  profileSourceIconClassName?: string
  showModeratorChip?: boolean
  profileSourceIconPosition?: 'none' | 'left' | 'right'
  color?: string
  labelingData?: { chatId: string }
  clipText?: boolean
  asLink?: boolean
}

export default function Name({
  address,
  className,
  additionalText,
  profileSourceIconClassName,
  color,
  labelingData,
  showModeratorChip,
  clipText,
  profileSourceIconPosition = 'none',
  asLink,
  ...props
}: NameProps) {
  const sendEvent = useSendEvent()
  const { inView, ref } = useInView({ triggerOnce: true })

  const { isLoading, name, textColor, profile } = useName(address)

  const { data: linkedIdentity } =
    getLinkedIdentityFromMainAddressQuery.useQuery(address, {
      enabled: profileSourceIconPosition !== 'none',
    })

  const identitiesIcons = (
    <div className='flex items-center'>
      {linkedIdentity?.externalProviders?.map((p) => {
        const {
          icon: Icon,
          tooltip,
          link,
        } = profileSourceData[p.provider] || {}

        return (
          <div
            key={p.externalId}
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
                  href={link?.(p.externalId, address)}
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
      })}
    </div>
  )

  if (isLoading) {
    return (
      <span
        {...props}
        className={cx(
          'relative flex animate-pulse items-stretch gap-2.5 overflow-hidden outline-none',
          className
        )}
      >
        <span className='my-1 h-3 w-20 rounded-full bg-background-lighter font-medium' />
      </span>
    )
  }

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
      {profileSourceIconPosition === 'left' && identitiesIcons}
      <span
        className={cx(
          clipText && 'overflow-hidden text-ellipsis whitespace-nowrap'
        )}
      >
        {additionalText} {name}{' '}
      </span>
      {profileSourceIconPosition === 'right' && identitiesIcons}
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

export function useName(address: string) {
  const { data: profile, isLoading: isLoadingProfile } =
    getProfileQuery.useQuery(address)
  const textColor = useRandomColor(address)

  let name = generateRandomName(address)

  const userProfileName = profile?.profileSpace?.content?.name
  if (userProfileName) {
    name = userProfileName
  }

  return {
    name,
    profile,
    isLoading: isLoadingProfile,
    textColor,
  }
}
