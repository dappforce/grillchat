import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/datahub/profiles/query'
import { cx } from '@/utils/class-names'
import { getUserProfileLink } from '@/utils/links'
import { generateRandomName } from '@/utils/random-name'
import { ComponentProps, ComponentPropsWithoutRef, forwardRef } from 'react'
import { useInView } from 'react-intersection-observer'
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
  withProfileModal?: boolean
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
  withProfileModal = true,
  asLink,
  ...props
}: NameProps) {
  const { ref } = useInView({ triggerOnce: true })

  const { isLoading, name, profile, textColor } = useName(address)

  const profileLink = asLink
    ? getUserProfileLink(profile?.profileSpace?.id)
    : undefined

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

  return (
    <>
      <LinkOrText
        {...props}
        href={profileLink}
        ref={ref}
        className={cx(
          'flex items-center gap-1',
          clipText && 'overflow-hidden',
          { ['cursor-pointer']: withProfileModal },
          className
        )}
        style={{ color: color || textColor }}
      >
        <span
          className={cx(
            clipText && 'overflow-hidden text-ellipsis whitespace-nowrap'
          )}
        >
          {additionalText} {name}{' '}
        </span>
      </LinkOrText>
    </>
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
        <span>Message user</span>
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
