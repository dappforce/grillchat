import FloatingMenus from '@/components/floating/FloatingMenus'
import LinkText from '@/components/LinkText'
import { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { UserType } from './UsersEarnInfo'
import { cx } from '@/utils/class-names'
import { useAnalytics, useSendEvent } from '@/stores/analytics'

export type UserTypeDropdownProps = {
  value: UserType
  onChangeValue: (value: UserType) => void
}

export default function UserTypeDropdown({
  value,
  onChangeValue,
}: UserTypeDropdownProps) {
  const [open, setOpen] = useState(false)
  const sendEvent = useSendEvent()
  const deviceId = useAnalytics((state) => state.deviceId)
  const userId = useAnalytics((state) => state.userId)

  const onDropdownValueChange = (value: UserType) => {
    onChangeValue(value)
    sendEvent('cs_rewards_guide_changed', { value }, { deviceId, userId })
  }

  return (
    <FloatingMenus
      manualMenuController={{
        open,
        onOpenChange: setOpen,
      }}
      menus={[
        {
          text: 'Staker',
          onClick: () => onDropdownValueChange('staker'),
        },
        {
          text: 'Creator',
          onClick: () => onDropdownValueChange('creator'),
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
              <span className='inline-block'>
                <span className='flex items-center gap-2 w-fit'>
                  {value} <FaAngleDown className={cx(
                    {
                      ['-rotate-90']: open,
                      ['rotate-0']: !open,
                    },
                    'transition-transform duration-300 ease-out'
                  )}/>
                </span>
              </span>
            </LinkText>
          </span>
        )
      }}
    </FloatingMenus>
  )
}
