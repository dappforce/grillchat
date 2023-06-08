import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import NftImage from './extensions/nft/NftImage'
import Modal from './modals/Modal'

export type ClickableImageProps = Omit<ImageProps, 'onClick'> & {
  trigger?: (onClick: () => void) => JSX.Element
}

export default function ClickableImage({
  trigger,
  ...props
}: ClickableImageProps) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  return (
    <>
      {trigger ? (
        trigger(() => setIsOpenModal(true))
      ) : (
        <Image
          {...props}
          className={cx('cursor-pointer', props.className)}
          onClick={() => setIsOpenModal(true)}
          alt={props.alt ?? ''}
        />
      )}
      <Modal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        panelClassName='bg-transparent'
        contentClassName='p-0'
        size='screen-md'
      >
        <NftImage
          {...props}
          image={props.src ?? ''}
          className='max-h-[95vh] w-full max-w-screen-md object-contain'
          alt={props.alt ?? ''}
          width={1024}
          height={1024}
        />
      </Modal>
    </>
  )
}
