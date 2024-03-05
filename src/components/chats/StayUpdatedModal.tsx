import BellIcon from '@/assets/icons/bell.svg'
import useLoginOption from '@/hooks/useLoginOption'
import { useSendEvent } from '@/stores/analytics'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { installApp, isInstallAvailable } from '@/utils/install'
import { useEffect, useState } from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { HiOutlineDownload, HiOutlineMail } from 'react-icons/hi'
import MenuList, { MenuListProps } from '../MenuList'
import EmailSubscriptionModal, {
  emailSubscribedStorage,
} from '../modals/EmailSubscriptionModal'
import Modal, { ModalFunctionalityProps } from '../modals/Modal'

export type StayUpdatedModalProps = ModalFunctionalityProps

export default function StayUpdatedModal({ ...props }: StayUpdatedModalProps) {
  const { loginOption } = useLoginOption()
  const sendEvent = useSendEvent()

  const [isOpenEmailModal, setIsOpenEmailModal] = useState(false)
  const openModal = useProfileModal((state) => state.openModal)
  const closeModal = useProfileModal((state) => state.closeModal)
  const isOpenProfile = useProfileModal((state) => state.isOpen)

  useEffect(() => {
    if (props.isOpen) {
      sendEvent('reengagement_modal_opened')
    }
  }, [props.isOpen, sendEvent])

  const menus: MenuListProps['menus'] = [
    {
      text: 'Push notifications',
      icon: BellIcon,
      onClick: () => {
        sendEvent('reengagement_modal_item_selected', {
          eventSource: 'push_notifs',
        })
        openModal({
          defaultOpenState: 'push-notifications',
          onBackClick: closeModal,
        })
      },
    },
    {
      text: 'Telegram bot',
      icon: FaTelegramPlane,
      onClick: () => {
        sendEvent('reengagement_modal_item_selected', {
          eventSource: 'telegram_notifs',
        })
        openModal({
          defaultOpenState: 'telegram-notifications',
          onBackClick: closeModal,
        })
      },
    },
  ]

  if (isInstallAvailable()) {
    menus.unshift({
      text: 'Install app',
      icon: HiOutlineDownload,
      onClick: () => {
        sendEvent('reengagement_modal_item_selected', {
          eventSource: 'install_app',
        })
        installApp()
      },
    })
  }

  if (loginOption === 'polkadot' && emailSubscribedStorage.get() !== 'true') {
    menus.unshift({
      text: 'Subscribe Email',
      icon: HiOutlineMail,
      onClick: () => {
        setIsOpenEmailModal(true)
        sendEvent('reengagement_modal_item_selected', {
          eventSource: 'subscribe_email',
        })
      },
    })
  }

  return (
    <>
      <Modal
        {...props}
        isOpen={props.isOpen && !isOpenProfile && !isOpenEmailModal}
        closeModal={() => {
          sendEvent('reengagement_modal_closed')
          props.closeModal()
        }}
        title='🔔 Stay Updated'
        description='Enable Grill notifications to stay engaged. You can disable them at any time.'
        panelClassName={cx('rounded-b-xl')}
        contentClassName={cx('!px-0 !pb-3')}
        titleClassName={cx('px-6')}
        descriptionClassName={cx('px-6')}
        withCloseButton
      >
        <MenuList className='py-0' menus={menus} />
      </Modal>
      <EmailSubscriptionModal
        onBackClick={() => setIsOpenEmailModal(false)}
        isOpen={isOpenEmailModal}
        closeModal={() => setIsOpenEmailModal(false)}
      />
    </>
  )
}
