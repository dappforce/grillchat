import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import Modal from './Modal'

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
        size='full-screen'
      >
        <Image
          {...props}
          className='w-full max-w-screen-xl'
          alt={props.alt ?? ''}
          width={1280}
        />
      </Modal>
    </>
  )
}
