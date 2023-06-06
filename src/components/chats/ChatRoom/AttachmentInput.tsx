import Button, { ButtonProps } from '@/components/Button'
import FloatingMenus from '@/components/floating/FloatingMenus'
import { cx } from '@/utils/class-names'
import { ImAttachment } from 'react-icons/im'

export type AttachmentInputProps = ButtonProps

export default function AttachmentInput({ ...props }: AttachmentInputProps) {
  return (
    <>
      <FloatingMenus
        menus={[{ icon: ImAttachment, text: 'asdfasdf' }]}
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
              className={cx('text-lg text-text-muted', props.className)}
            >
              <ImAttachment />
            </Button>
          )
        }}
      </FloatingMenus>
    </>
  )
}
