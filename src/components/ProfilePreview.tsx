import EthIcon from '@/assets/icons/eth-dynamic-size.svg'
import GrillIcon from '@/assets/icons/grill.svg'
import PolkadotIcon from '@/assets/icons/polkadot-dynamic-size.svg'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount, useMyMainAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ProfileSource } from '@/utils/profile'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { HiPencil } from 'react-icons/hi2'
import AddressAvatar from './AddressAvatar'
import AllIdentityIcons from './AllIdentityIcons'
import Button from './Button'
import { CopyTextInline } from './CopyText'
import PopOver from './floating/PopOver'
import Name, { useName } from './Name'

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
  showAllIdentity?: boolean
}

const ProfilePreview = ({
  address,
  forceProfileSource,
  className,
  avatarClassName,
  nameClassName,
  addressesContainerClassName,
  onEditClick,
  showAddress = true,
  showAllIdentity,
  ...props
}: ProfilePreviewProps) => {
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

  return (
    <div {...props} className={cx('flex items-center gap-4', className)}>
      <AddressAvatar
        address={address}
        className={cx('h-20 w-20', avatarClassName)}
        forceProfileSource={forceProfileSource}
      />
      <div className={cx('flex flex-col gap-1', addressesContainerClassName)}>
        <div className='relative left-1 flex items-center gap-2'>
          <Name
            profileSourceIconClassName='text-base'
            profileSourceIconPosition='right'
            address={address}
            className={cx('gap-2 text-lg', nameClassName)}
            forceProfileSource={forceProfileSource}
          />
          {onEditClick && !isLoading && (
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
                  <HiPencil />
                </Button>
              }
            >
              <p>Edit my profile</p>
            </PopOver>
          )}
        </div>
        {showAddress && (
          <div className='flex flex-col gap-1'>
            {showGrillAddress && (
              <div className='flex flex-row items-center gap-2'>
                <GrillIcon className='text-xl text-text-muted' />
                <CopyTextInline
                  text={truncateAddress(address)}
                  tooltip={`Copy${isMyAddressPart} Grill public address`}
                  textToCopy={address}
                  textClassName={cx(
                    'font-mono text-base whitespace-nowrap overflow-hidden overflow-ellipsis'
                  )}
                />
              </div>
            )}
            {showPolkadotAddress && (
              <div className='flex flex-row items-center gap-2'>
                <PolkadotIcon className='relative left-1 text-xl text-text-muted' />
                <CopyTextInline
                  text={truncateAddress(address)}
                  tooltip={`Copy${isMyAddressPart} Polkadot address`}
                  textToCopy={address}
                  textClassName={cx(
                    'font-mono text-base whitespace-nowrap overflow-hidden overflow-ellipsis'
                  )}
                />
              </div>
            )}
            {showEvmAddress && (
              <div className='flex flex-row items-center gap-2'>
                <EthIcon className='relative left-1 text-xl text-text-muted' />
                <CopyTextInline
                  text={truncateAddress(evmAddress)}
                  tooltip={`Copy${isMyAddressPart} EVM address`}
                  textToCopy={evmAddress}
                  textClassName={cx(
                    'font-mono text-base whitespace-nowrap overflow-hidden overflow-ellipsis'
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
