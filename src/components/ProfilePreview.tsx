import useBreakpointThreshold from '@/hooks/useBreakpointThreshold'
import useLinkedEvmAddress from '@/hooks/useLinkedEvmAddress'
import { useMyMainAddress } from '@/stores/my-account'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import { ProfileSource } from '@/utils/profile'
import { ProfileContent } from '@subsocial/api/types'
import { ComponentProps } from 'react'
import { LuPencil } from 'react-icons/lu'
import { RiPencilFill } from 'react-icons/ri'
import { SiEthereum } from 'react-icons/si'
import { TbCoins } from 'react-icons/tb'
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
  onSetRewardAddressClick?: () => void
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
  onSetRewardAddressClick,
  showAddress = true,
  ...props
}: ProfilePreviewProps) => {
  const mdUp = useBreakpointThreshold('md')
  const { isLoading } = useName(address)
  const myAddress = useMyMainAddress()
  const { evmAddress: linkedEvmAddress } = useLinkedEvmAddress(address)

  const isMyAddressPart = myAddress === address ? ' my' : ''

  const editButton = mdUp ? (
    <Button size='circleSm' variant='muted' onClick={onEditClick}>
      <RiPencilFill />
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
        {showAddress && linkedEvmAddress ? (
          <div className='flex flex-col gap-1'>
            <div className='flex flex-row items-center gap-1.5'>
              <SiEthereum className='text-xl text-text-muted' />
              <CopyTextInline
                text={truncateAddress(linkedEvmAddress)}
                tooltip={`Copy${isMyAddressPart} address`}
                textToCopy={linkedEvmAddress}
                textClassName={cx(
                  'font-mono text-base whitespace-nowrap overflow-hidden overflow-ellipsis'
                )}
              />
            </div>
          </div>
        ) : (
          onSetRewardAddressClick && (
            <div>
              <Button
                className='mt-0.5 flex items-center gap-1.5 px-3 py-1 text-sm'
                size='sm'
                onClick={onSetRewardAddressClick}
              >
                <TbCoins />
                <span>Set Rewards Address</span>
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ProfilePreview
