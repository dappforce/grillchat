import useRandomColor from '@/hooks/useRandomColor'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import * as bottts from '@dicebear/bottts'
import { createAvatar } from '@dicebear/core'
import Image from 'next/image'
import { ComponentProps, forwardRef, useMemo, useState } from 'react'

export const resolveEnsAvatarSrc = (ensName: string) =>
  `https://metadata.ens.domains/mainnet/avatar/${ensName}`

export type AddressAvatarProps = ComponentProps<'div'> & {
  address: string
}

const AddressAvatar = forwardRef<HTMLDivElement, AddressAvatarProps>(
  function AddressAvatar({ address, ...props }: AddressAvatarProps, ref) {
    const backgroundColor = useRandomColor(address, 'dark')
    const [ensAvatarLoading, setEnsAvatarLoading] = useState(true)

    const { data: accountData, isLoading } =
      getAccountDataQuery.useQuery(address)

    const { ensName, withEnsAvatar } = accountData || {}

    const avatar = useMemo(() => {
      return createAvatar(bottts, {
        size: 128,
        seed: address,
      }).toDataUriSync()
    }, [address])

    if (!accountData && isLoading && ensAvatarLoading) {
      return (
        <div
          className={cx(
            'relative flex animate-pulse items-stretch gap-2.5 overflow-hidden outline-none'
          )}
        >
          <div
            style={{ backgroundClip: 'padding-box' }}
            className={cx(
              'bg-background-light',
              'rounded-full',
              'h-9 w-9 self-center sm:h-9 sm:w-9'
            )}
          ></div>
        </div>
      )
    }

    const avatarSrc =
      withEnsAvatar && ensName ? resolveEnsAvatarSrc(ensName) : avatar

    return (
      <div
        {...props}
        ref={ref}
        className={cx(
          'relative h-9 w-9 overflow-hidden rounded-full bg-background-lightest',
          props.className
        )}
        style={{ backgroundColor }}
      >
        <div
          className={cx('relative h-full w-full', {
            ['p-[7.5%]']: !withEnsAvatar,
          })}
        >
          <div className='relative h-full w-full'>
            <Image
              sizes='5rem'
              className='relative'
              fill
              src={avatarSrc}
              onLoad={() => setEnsAvatarLoading(false)}
              alt='avatar'
            />
          </div>
        </div>
      </div>
    )
  }
)

export default AddressAvatar
