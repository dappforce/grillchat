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

    const [ensAvatarLoaded, setEnsAvatarLoaded] = useState(false)

    const { data: accountData, isLoading } =
      getAccountDataQuery.useQuery(address)

    const { ensName } = accountData || {}

    const avatar = useMemo(() => {
      return createAvatar(bottts, {
        size: 128,
        seed: address,
      }).toDataUriSync()
    }, [address])

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
        {ensName && (
          <div
            className={cx(
              'absolute inset-0 h-full w-full transition-opacity',
              ensAvatarLoaded ? 'z-10 opacity-100' : '-z-10 opacity-0'
            )}
          >
            <div className='relative h-full w-full'>
              <Image
                sizes='5rem'
                className='relative rounded-full'
                fill
                src={resolveEnsAvatarSrc(ensName)}
                onLoad={() => setEnsAvatarLoaded(true)}
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
