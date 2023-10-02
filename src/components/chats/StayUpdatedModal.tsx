import BellIcon from '@/assets/icons/bell.svg'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { installApp } from '@/utils/install'
import { useEffect, useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiOutlineDownload } from 'react-icons/hi'
import ProfileModal from '../auth/ProfileModal'
import { ProfileModalState } from '../auth/ProfileModal/types'
import MenuList from '../MenuList'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'

export type StayUpdatedModalProps = ModalFunctionalityProps

export default function StayUpdatedModal({ ...props }: StayUpdatedModalProps) {
  const sendEvent = useSendEvent()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [profileModalState, setProfileModalState] =
    useState<ProfileModalState>('push-notifications')

  useEffect(() => {
    if (props.isOpen) {
      sendEvent('reengagement_modal_opened')
    }
  }, [props.isOpen, sendEvent])

  return (
    <>
      <Modal
        {...props}
        isOpen={props.isOpen && !isProfileModalOpen}
        closeModal={() => {
          sendEvent('reengagement_modal_closed')
          props.closeModal()
        }}
        title='🔔 Stay Updated'
        description='Enable Grill.chat notifications to stay engaged. You can disable them at any time.'
        contentClassName={cx('!px-0')}
        titleClassName={cx('px-6')}
        descriptionClassName={cx('px-6')}
        withCloseButton
      >
        <MenuList
          className='py-0'
          menus={[
            {
              text: 'Install app',
              icon: HiOutlineDownload,
              onClick: () => {
                sendEvent('reengagement_modal_item_selected', {
                  eventSource: 'install_app',
                })
                installApp()
              },
            },
            {
              text: 'Push notifications',
              icon: BellIcon,
              onClick: () => {
                sendEvent('reengagement_modal_item_selected', {
                  eventSource: 'push_notifs',
                })
                setProfileModalState('push-notifications')
                setIsProfileModalOpen(true)
              },
            },
            {
              text: 'Telegram bot',
              icon: FaTelegramPlane,
              onClick: () => {
                sendEvent('reengagement_modal_item_selected', {
                  eventSource: 'telegram_notifs',
                })
                setProfileModalState('telegram-notifications')
                setIsProfileModalOpen(true)
              },
            },
          ]}
        />
      </Modal>
      <ProfileModal
        isOpen={isProfileModalOpen}
        step={profileModalState}
        closeModal={() => setIsProfileModalOpen(false)}
        onBackClick={() => setIsProfileModalOpen(false)}
      />
    </>
  )
}
