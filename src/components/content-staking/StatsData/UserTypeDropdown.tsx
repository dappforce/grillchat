import FloatingMenus from '@/components/floating/FloatingMenus'
import LinkText from '@/components/LinkText'
import { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { UserType } from './UsersEarnInfo'

export type UserTypeDropdownProps = {
  value: UserType
  onChangeValue: (value: UserType) => void
}

export default function UserTypeDropdown({
  value,
  onChangeValue,
}: UserTypeDropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <FloatingMenus
      manualMenuController={{
        open,
        onOpenChange: setOpen,
      }}
      menus={[
        {
          text: 'Staker',
          onClick: () => onChangeValue('staker'),
        },
        {
          text: 'Creator',
          onClick: () => onChangeValue('creator'),
        },
      ]}
      allowedPlacements={['bottom-start', 'bottom-end', 'bottom']}
      mainAxisOffset={20}
    >
      {(config) => {
        const { referenceProps } = config || {}

        return (
          <span onClick={() => setOpen(!open)} className='w-fit'>
            <LinkText
              variant={'primary'}
              {...referenceProps}
              className='hover:no-underline'
            >
              <span className='flex items-center gap-2'>
                {value} <FaAngleDown />
              </span>
            </LinkText>
          </span>
        )
      }}
    </FloatingMenus>
  )
}
