import NftIcon from '@/assets/icons/nft.svg'
import Button, { ButtonProps } from '@/components/Button'
import FloatingMenus from '@/components/floating/FloatingMenus'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { ImAttachment } from 'react-icons/im'
import { IoImageOutline } from 'react-icons/io5'

export type AttachmentInputProps = ButtonProps

export default function AttachmentInput({ ...props }: AttachmentInputProps) {
  const [openAttachmentModalId, setOpenAttachmentModalId] = useState<
    '' | 'nft' | 'image'
  >('nft')

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
      {/* <NftAttachmentModal
        isOpen={openAttachmentModalId === 'nft'}
        closeModal={() => setOpenAttachmentModalId('')}
      /> */}
    </>
  )
}
