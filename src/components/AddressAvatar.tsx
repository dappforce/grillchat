import useRandomColor from '@/hooks/useRandomColor'
import { getProfileQuery } from '@/services/api/query'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { decodeProfileSource } from '@/utils/profile'
import * as bottts from '@dicebear/bottts'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import {
  ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ForceProfileSource } from './Name'

export const resolveEnsAvatarSrc = (ensName: string) =>
  `https://metadata.ens.domains/mainnet/avatar/${ensName}`

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
  forceProfileSource?: ForceProfileSource
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar(
    { address, forceProfileSource, ...props }: AddressAvatarProps,
    ref
  ) {
    const backgroundColor = useRandomColor(address, {
      isAddress: true,
      theme: 'dark',
    })

    const [isAvatarError, setIsAvatarError] = useState(false)
    const onImageError = useCallback(() => setIsAvatarError(true), [])

    const { data: accountData, isLoading } =
      getAccountDataQuery.useQuery(address)

    const { data: profile } = getProfileQuery.useQuery(address)
    const { ensNames } = accountData || {}

    const avatar = useMemo(() => {
      return createAvatar(bottts, {
        size: 128,
        seed: address,
      }).toDataUriSync()
    }, [address])

    const profileSource = profile?.profileSpace?.content?.profileSource
    const subsocialProfileImage = profile?.profileSpace?.content?.image
    const profileAvatar = useMemo(() => {
      const { source, content } = decodeProfileSource(profileSource)
      const usedProfileSource = forceProfileSource?.profileSource || source
      const usedContent = forceProfileSource?.content || content
      switch (usedProfileSource) {
        case 'ens':
          const hasSelectedEns = ensNames?.includes(usedContent ?? '')
          return hasSelectedEns
            ? resolveEnsAvatarSrc(usedContent ?? '')
            : undefined
        case 'subsocial-profile':
          return subsocialProfileImage
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
              'bg-background-light',
              'rounded-full',
              'h-9 w-9 self-center',
              props.className
            )}
          ></div>
        </div>
      )
    }

    return (
      <div
        {...props}
        ref={ref}
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
                className='relative rounded-full'
                fill
                src={profileAvatar}
                onError={onImageError}
                alt='avatar'
              />
            </div>
          </div>
        )}

        <div className={cx('relative h-full w-full p-[7.5%]')}>
          <div className='relative h-full w-full'>
            <Image
              sizes='5rem'
              className='relative rounded-full'
              fill
              src={avatar}
              alt='avatar'
            />
          </div>
        </div>
      </div>
    )
  }
)

export default AddressAvatar
