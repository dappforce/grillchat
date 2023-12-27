import NftIcon from '@/assets/icons/nft.svg'
import Button, { ButtonProps } from '@/components/Button'
import FloatingMenus from '@/components/floating/FloatingMenus'
import { useExtensionData } from '@/stores/extension'
import { cx } from '@/utils/class-names'
import { ImAttachment } from 'react-icons/im'
import { IoImageOutline } from 'react-icons/io5'
import { ChatFormProps } from '../ChatForm'

export type AttachmentInputProps = ButtonProps & Pick<ChatFormProps, 'chatId'>

export default function AttachmentInput({
  chatId,
  ...props
}: AttachmentInputProps) {
  const openExtensionModal = useExtensionData(
    (state) => state.openExtensionModal
  )

  return (
    <FloatingMenus
      showOnHover
      menus={[
        {
          icon: NftIcon,
          text: 'NFT',
          onClick: () => openExtensionModal('subsocial-evm-nft', null),
        },
        {
          icon: IoImageOutline,
          text: 'Image',
          onClick: () => openExtensionModal('subsocial-image', null),
        },
      ]}
      allowedPlacements={['top-start']}
      mainAxisOffset={20}
    >
      {(config) => {
        const { toggleDisplay, referenceProps } = config || {}

        return (
          <Button
            size='circle'
            variant='transparent'
            interactive='brightness-only'
            {...referenceProps}
            {...props}
            onClick={toggleDisplay}
            className={cx(
              'text-lg text-text-muted',
              'hover:text-background-primary focus-visible:text-background-primary',
              props.className
            )}
          >
            <ImAttachment />
          </Button>
        )
      }}
    </FloatingMenus>
  )
}
