import { useConfigContext } from '@/providers/ConfigProvider'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { RiCopperCoinLine } from 'react-icons/ri'
import ActionCard from './ActionCard'
import { useOpenDonateExtension } from './extensions/donate/hooks'
import Modal from './modals/Modal'
import Name, { NameProps } from './Name'
import ProfilePreview from './ProfilePreview'

export type ProfilePreviewModalWrapperProps = {
  address: string
  messageId?: string
  children: (
    onClick: (e: { stopPropagation: () => void }) => void
  ) => React.ReactNode
}

export default function ProfilePreviewModalWrapper({
  address,
  messageId,
  children,
}: ProfilePreviewModalWrapperProps) {
  const openDonateExtension = useOpenDonateExtension(messageId ?? '', address)
  const [isOpenAccountModal, setIsOpenAccountModal] = useState(false)
  const { data: accountData } = getAccountDataQuery.useQuery(address)
  const { evmAddress } = accountData || {}
  const { enableDonations } = useConfigContext()

  return (
    <>
      {children((e) => {
        e.stopPropagation()
        setIsOpenAccountModal(true)
      })}
      <Modal
        title='Profile'
        withCloseButton
        isOpen={isOpenAccountModal}
        closeModal={() => setIsOpenAccountModal(false)}
      >
        <ProfilePreview address={address} className='mb-2' />
        {evmAddress && messageId && enableDonations && (
          <ActionCard
            className='mt-2'
            actions={[
              {
                icon: RiCopperCoinLine,
                text: 'Donate',
                iconClassName: cx('text-text-muted'),
                onClick: () => openDonateExtension(),
              },
            ]}
          />
        )}
      </Modal>
    </>
  )
}

export function ProfilePreviewModalName({
  messageId,
  ...props
}: NameProps & { messageId?: string }) {
  return (
    <ProfilePreviewModalWrapper address={props.address} messageId={messageId}>
      {(onClick) => (
        <Name
          {...props}
          onClick={(e) => {
            onClick(e)
            props.onClick?.(e)
          }}
          className={cx('cursor-pointer', props.className)}
          address={props.address}
        />
      )}
    </ProfilePreviewModalWrapper>
  )
}
