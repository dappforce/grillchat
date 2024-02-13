import EthIcon from '@/assets/icons/eth-dynamic-size.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import PolkadotIcon from '@/assets/icons/polkadot-dynamic-size.svg'
import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ProfileSource } from '@/utils/profile'
import { Placement } from '@floating-ui/react'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { LuPencil } from 'react-icons/lu'
import AddressAvatar from './AddressAvatar'
import AllIdentityIcons from './AllIdentityIcons'
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
  nameContainerClassName?: string
  addressClassName?: string
  showAddress?: boolean
  nameClassName?: string
  onEditClick?: () => void
  showAllIdentity?: boolean
  tooltipPlacement?: Placement
}

const ProfilePreview = ({
  address,
  forceProfileSource,
  className,
  avatarClassName,
  nameClassName,
  nameContainerClassName,
  addressClassName,
  tooltipPlacement,
  onEditClick,
  showAddress = true,
  showAllIdentity,
  ...props
}: ProfilePreviewProps) => {
  const mdUp = useBreakpointThreshold('md')
  const { isLoading } = useName(address)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { evmAddress } = accountData || {}

  const isMyProxyAddress = !!useMyAccount(
    (state) => state.parentProxyAddress === address
  )
  const myAddress = useMyMainAddress()

  const isMyAddressPart = myAddress === address ? ' my' : ''

  const showGrillAddress = !isMyProxyAddress && !evmAddress
  const showEvmAddress = !!evmAddress
  const showPolkadotAddress = !!isMyProxyAddress

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
        address={address}
        className={cx(
          // if avatarClassName is provided, use it, otherwise use default size
          avatarClassName ? 'h-20 w-20' : 'h-16 w-16 md:h-20 md:w-20',
          avatarClassName
        )}
        forceProfileSource={forceProfileSource}
      />
      <div className={cx('flex flex-col gap-1', nameContainerClassName)}>
        <div className='relative left-1 flex items-center gap-2'>
          <Name
            profileSourceIconClassName='text-base'
            profileSourceIconPosition='right'
            address={address}
            className={cx('gap-2 text-lg', nameClassName)}
            forceProfileSource={forceProfileSource}
          />
          {onEditClick && !isLoading && editButton}
        </div>
        {showAddress && (
          <div
            className={cx('flex flex-col gap-1 text-base', addressClassName)}
          >
            {showGrillAddress && (
              <div className='flex flex-row items-center gap-2'>
                <GrillIcon className='text-[1.25em] text-text-muted' />
                <CopyTextInline
                  tooltipPlacement={tooltipPlacement}
                  text={truncateAddress(address)}
                  tooltip={`Copy${isMyAddressPart} Grill public address`}
                  textToCopy={address}
                  textClassName={cx(
                    'font-mono whitespace-nowrap overflow-hidden overflow-ellipsis'
                  )}
                />
              </div>
            )}
            {showPolkadotAddress && (
              <div className='flex flex-row items-center gap-2'>
                <PolkadotIcon className='relative left-1 text-[1.25em] text-text-muted' />
                <CopyTextInline
                  tooltipPlacement={tooltipPlacement}
                  text={truncateAddress(address)}
                  tooltip={`Copy${isMyAddressPart} Polkadot address`}
                  textToCopy={address}
                  textClassName={cx(
                    'font-mono whitespace-nowrap overflow-hidden overflow-ellipsis'
                  )}
                />
              </div>
            )}
            {showEvmAddress && (
              <div className='flex flex-row items-center gap-2'>
                <EthIcon className='relative left-1 text-[1.25em] text-text-muted' />
                <CopyTextInline
                  text={truncateAddress(evmAddress)}
                  tooltip={`Copy${isMyAddressPart} EVM address`}
                  textToCopy={evmAddress}
                  textClassName={cx(
                    'font-mono whitespace-nowrap overflow-hidden overflow-ellipsis'
                  )}
                />
              </div>
            )}
          </div>
        )}
        {showAllIdentity && (
          <AllIdentityIcons className='mt-1' address={address} />
        )}
      </div>
    </div>
  )
}

export default ProfilePreview
