import BellIcon from '@/assets/icons/bell.svg'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { installApp } from '@/utils/install'
import { useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiOutlineDownload } from 'react-icons/hi'
import ProfileModal from '../auth/ProfileModal'
import { ProfileModalState } from '../auth/ProfileModal/types'
import MenuList from '../MenuList'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'

export type KeepMeUpdatedModalProps = ModalFunctionalityProps

export default function KeepMeUpdatedModal({
  ...props
}: KeepMeUpdatedModalProps) {
  const sendEvent = useSendEvent()
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [profileModalState, setProfileModalState] =
    useState<ProfileModalState>('push-notifications')

  return (
    <>
      <Modal
        {...props}
        isOpen={props.isOpen && !isProfileModalOpen}
        closeModal={() => {
          sendEvent('close_keep_me_updated_modal')
          props.closeModal()
        }}
        title='🔔 Keep Me Updated'
        description='Receive Grill.chat notifications in various locations. You can edit it in any time.'
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
                sendEvent('keep_me_updated_install_app')
                installApp()
              },
            },
            {
              text: 'Push notifications',
              icon: BellIcon,
              onClick: () => {
                sendEvent('keep_me_updated_push_notifications')
                setProfileModalState('push-notifications')
                setIsProfileModalOpen(true)
              },
            },
            {
              text: 'Telegram bot',
              icon: FaTelegramPlane,
              onClick: () => {
                sendEvent('keep_me_updated_telegram_notifications')
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
