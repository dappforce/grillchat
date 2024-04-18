import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { getIpfsContentUrl } from '@/utils/ipfs'
import { getUserProfileLink } from '@/utils/links'
import { decodeProfileSource } from '@/utils/profile'
import Identicon from '@polkadot/react-identicon'
import Image from 'next/image'
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ForceProfileSource } from './ProfilePreview'
import PopOver from './floating/PopOver'
import CustomLink from './referral/CustomLink'

export const resolveEnsAvatarSrc = (ensName: string) =>
  `https://euc.li/${ensName}`

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
  asLink?: boolean
  forceProfileSource?: ForceProfileSource
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar(
    { address, forceProfileSource, asLink, ...props }: AddressAvatarProps,
    ref
  ) {
    const backgroundColor = useRandomColor(address, {
      isAddress: true,
    })

    const [isAvatarError, setIsAvatarError] = useState(false)
    const onImageError = useCallback(() => setIsAvatarError(true), [])

    const { data: accountData } = getAccountDataQuery.useQuery(address)

    const { data: profile, isLoading } = getProfileQuery.useQuery(address)
    const { ensNames } = accountData || {}

    const profileSource = profile?.profileSpace?.content?.profileSource
    const subsocialProfileImage = profile?.profileSpace?.content?.image
    const profileAvatar = useMemo(() => {
      if (forceProfileSource?.content?.image)
        return getIpfsContentUrl(forceProfileSource.content.image)

      const { source, content } = decodeProfileSource(profileSource)
      const usedProfileSource = forceProfileSource?.profileSource || source
      const usedName = forceProfileSource?.content?.name || content
      switch (usedProfileSource) {
        case 'ens':
          const hasSelectedEns = ensNames?.includes(usedName ?? '')
          return hasSelectedEns
            ? resolveEnsAvatarSrc(usedName ?? '')
            : undefined
        case 'subsocial-profile':
          return subsocialProfileImage
            ? getIpfsContentUrl(subsocialProfileImage)
            : undefined
      }
    }, [
      profileSource,
      forceProfileSource?.profileSource,
      forceProfileSource?.content,
      subsocialProfileImage,
      ensNames,
    ])

    useEffect(() => {
      setIsAvatarError(false)
    }, [profileAvatar])

    if (isLoading) {
      return (
        <div
          className={cx(
            'relative flex flex-shrink-0 animate-pulse items-stretch gap-2.5 overflow-hidden outline-none'
          )}
        >
          <div
            style={{ backgroundClip: 'padding-box' }}
            className={cx(
              'bg-background-lighter/50',
              'rounded-full',
              'h-9 w-9 self-center',
              props.className
            )}
          ></div>
        </div>
      )
    }

    const profileLink = asLink
      ? getUserProfileLink(profile?.profileSpace?.id)
      : undefined

    return (
      <LinkOrText
        {...props}
        href={profileLink}
        ref={ref as any}
        className={cx(
          'relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-background-lightest',
          props.className
        )}
        style={{ backgroundColor }}
      >
        {profileAvatar && (
          <div
            className={cx(
              'absolute inset-0 h-full w-full transition-opacity',
              !isAvatarError ? 'z-10 opacity-100' : '-z-10 opacity-0'
            )}
          >
            <div className='relative h-full w-full'>
              <Image
                sizes='5rem'
                className='relative rounded-full object-cover'
                fill
                src={profileAvatar}
                onError={onImageError}
                alt='avatar'
              />
            </div>
          </div>
        )}

        <div className={cx('relative h-full w-full')}>
          <IdenticonAvatar
            value={address}
            className='h-full w-full !cursor-[inherit]'
          />
        </div>
      </LinkOrText>
    )
  }
)

function IdenticonAvatar({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  return (
    <Identicon
      theme='polkadot'
      value={value}
      className={cx('[&_svg]:h-full [&_svg]:w-full', className)}
    />
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

export default AddressAvatar
