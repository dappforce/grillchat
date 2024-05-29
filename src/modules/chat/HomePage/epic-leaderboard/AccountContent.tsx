import Card from '@/components/Card'
import MenuList, { MenuListProps } from '@/components/MenuList'
import ProfilePreview from '@/components/ProfilePreview'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { RiUserSettingsLine } from 'react-icons/ri'
import { TbDeviceMobilePlus } from 'react-icons/tb'

const LeaderboardAccountContent = () => {
  const address = useMyMainAddress()
  const { openModal, defaultOpenState } = useProfileModal()

  const menus: MenuListProps['menus'] = [
    {
      text: 'Linked Accounts',
      icon: RiUserSettingsLine,
      onClick: () => {
        openModal({
          defaultOpenState: 'linked-identities',
        })
      },
    },
    {
      text: 'Share Session',
      icon: TbDeviceMobilePlus,
      onClick: () => {
        openModal({
          defaultOpenState: 'share-session',
        })
      },
    },
  ]

  return (
    <div className='flex flex-col gap-5 p-4'>
      <Card className='flex flex-col gap-2 bg-background-light p-[18px]'>
        <div>
          <ProfilePreview
            onEditClick={() => {
              openModal({
                defaultOpenState: 'profile-settings',
              })
            }}
            address={address || ''}
            className='flex-col items-center justify-center gap-4'
            addressesContainerClassName='items-center gap-4 leading-none'
            onSetRewardAddressClick={() => {
              openModal({
                defaultOpenState: 'add-evm-provider',
              })
            }}
          />
        </div>
      </Card>
      <Card className='flex flex-col gap-2 bg-background-light px-[6px] py-[6px]'>
        <MenuList menus={menus} className='p-0' />
      </Card>
    </div>
  )
}

export default LeaderboardAccountContent
