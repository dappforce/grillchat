import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import Modal from './modals/Modal'

export type ClickableImageProps = Omit<ImageProps, 'onClick'>

export default function ClickableImage({ ...props }: ClickableImageProps) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  return (
    <>
      <Image
        {...props}
        className={cx('cursor-pointer', props.className)}
        onClick={() => setIsOpenModal(true)}
        alt={props.alt ?? ''}
      />
      <Modal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        contentClassName='p-0'
        size='screen-lg'
      >
        <Image
          {...props}
          className='w-full max-w-screen-lg'
          alt={props.alt ?? ''}
          width={1024}
        />
      </Modal>
    </>
  )
}
