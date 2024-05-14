import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useMyGrillAddress, useMyMainAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ProfileSource } from '@/utils/profile'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { LuPencil } from 'react-icons/lu'
import { SiEthereum } from 'react-icons/si'
import AddressAvatar from './AddressAvatar'
import Button from './Button'
import { CopyTextInline } from './CopyText'
import Name, { useName } from './Name'
import PopOver from './floating/PopOver'

export type ForceProfileSource = {
  profileSource?: ProfileSource
  content?: ProfileContent
}

export type ProfilePreviewProps = ComponentProps<'div'> & {
  address: string
  forceProfileSource?: ForceProfileSource
  className?: string
  avatarClassName?: string
  addressesContainerClassName?: string
  showAddress?: boolean
  nameClassName?: string
  onEditClick?: () => void
  asLink?: boolean
  withPolkadotIdentity?: boolean
}

const ProfilePreview = ({
  address,
  forceProfileSource,
  className,
  avatarClassName,
  nameClassName,
  addressesContainerClassName,
  asLink,
  onEditClick,
  showAddress = true,
  ...props
}: ProfilePreviewProps) => {
  const mdUp = useBreakpointThreshold('md')
  const { isLoading } = useName(address)
  const myAddress = useMyMainAddress()
  const myGrillAddress = useMyGrillAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    myGrillAddress ?? ''
  )
  const myLinkedEvmAddress = linkedIdentity?.externalProviders.find(
    (identity) => identity.provider === IdentityProvider.Evm
  )?.externalId

  const isMyAddressPart = myAddress === address ? ' my' : ''

  const editButton = mdUp ? (
    <Button
      size='noPadding'
      className='relative flex items-center gap-1 border-border-gray px-2 py-0.5 text-sm text-text-primary'
      variant='primaryOutline'
      onClick={onEditClick}
    >
      <span>Edit</span>
      <LuPencil />
    </Button>
  ) : (
    <PopOver
      panelSize='sm'
      triggerOnHover
      placement='top'
      yOffset={6}
      trigger={
        <Button
          size='noPadding'
          className='relative top-px p-1 text-text-primary'
          variant='transparent'
          onClick={onEditClick}
        >
          <LuPencil />
        </Button>
      }
    >
      <p>Edit my profile</p>
    </PopOver>
  )

  return (
    <div {...props} className={cx('flex items-center gap-3', className)}>
      <AddressAvatar
        asLink={asLink}
        address={address}
        className={cx(
          // if avatarClassName is provided, use it, otherwise use default size
          avatarClassName ? 'h-18 w-18' : 'md:h-18 md:w-18 h-16 w-16',
          avatarClassName
        )}
        forceProfileSource={forceProfileSource}
      />
      <div className={cx('flex flex-col gap-1', addressesContainerClassName)}>
        <div className='ml-0.5 flex items-center gap-2'>
          <Name
            asLink={asLink}
            profileSourceIconClassName='text-base'
            profileSourceIconPosition='right'
            address={address}
            className={cx('gap-2 text-lg', nameClassName)}
          />
          {onEditClick && !isLoading && editButton}
        </div>
        {showAddress && myLinkedEvmAddress && (
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-1.5'>
              <SiEthereum className='text-xl text-text-muted' />
              <CopyTextInline
                text={truncateAddress(myLinkedEvmAddress)}
                tooltip={`Copy${isMyAddressPart} address`}
                textToCopy={address}
                textClassName={cx(
                  'font-mono text-base whitespace-nowrap overflow-hidden overflow-ellipsis'
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePreview
