import Button, { ButtonProps } from '@/components/Button'
import CommonCustomContextMenu from '@/components/floating/CommonCustomContextMenu'
import { cx } from '@/utils/class-names'
import { ImAttachment } from 'react-icons/im'

export type AttachmentInputProps = ButtonProps & {}

export default function AttachmentInput({ ...props }: AttachmentInputProps) {
  return (
    <>
      <CommonCustomContextMenu
        menus={[{ icon: ImAttachment, text: 'asdfasdf' }]}
        allowedPlacements={['top-start']}
      >
        {(config) => {
          const { onContextMenu, referenceProps } = config || {}
          return (
            <Button
              size='circle'
              variant='transparent'
              {...referenceProps}
              {...props}
              onClick={onContextMenu}
              className={cx('text-lg text-text-muted', props.className)}
            >
              <ImAttachment />
            </Button>
          )
        }}
      </CommonCustomContextMenu>
    </>
  )
}
