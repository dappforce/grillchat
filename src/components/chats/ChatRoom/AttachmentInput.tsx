import NftIcon from '@/assets/icons/nft.svg'
import Button, { ButtonProps } from '@/components/Button'
import NftAttachmentModal from '@/components/extensions/nft/NftAttachmentModal'
import FloatingMenus from '@/components/floating/FloatingMenus'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { ImAttachment } from 'react-icons/im'
import { IoImageOutline } from 'react-icons/io5'
import { ChatFormProps } from '../ChatForm'

export type AttachmentInputProps = ButtonProps &
  Pick<ChatFormProps, 'chatId' | 'replyTo'>

export default function AttachmentInput({
  chatId,
  replyTo,
  ...props
}: AttachmentInputProps) {
  const [openAttachmentModalId, setOpenAttachmentModalId] = useState<
    null | 'nft' | 'image'
  >(null)

  return (
    <>
      <FloatingMenus
        menus={[
          {
            icon: NftIcon,
            text: 'NFT',
            onClick: () => setOpenAttachmentModalId('nft'),
          },
          { icon: IoImageOutline, text: 'Image' },
        ]}
        allowedPlacements={['top-start']}
        yOffset={20}
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
                'hover:text-background-primary focus:text-background-primary',
                props.className
              )}
            >
              <ImAttachment />
            </Button>
          )
        }}
      </FloatingMenus>
      <NftAttachmentModal
        replyTo={replyTo}
        chatId={chatId}
        isOpen={openAttachmentModalId === 'nft'}
        closeModal={() => setOpenAttachmentModalId(null)}
      />
    </>
  )
}
