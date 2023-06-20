import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import MediaLoader from './MediaLoader'
import Modal from './modals/Modal'

export type ClickableMediaProps = Omit<ImageProps, 'onClick'> & {
  trigger?: (onClick: () => void) => JSX.Element
}

export default function ClickableMedia({
  trigger,
  ...props
}: ClickableMediaProps) {
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
      {/* TODO: fix issue where tall images will have transparent space which makes the modal can't be closed when clicking on the that part */}
      <Modal
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
        panelClassName='bg-transparent shadow-none'
        contentClassName='!p-0'
        size='screen-md'
      >
        <MediaLoader
          {...props}
          src={props.src ?? ''}
          className='w-full max-w-screen-md'
          alt={props.alt ?? ''}
          width={1024}
          height={1024}
        />
      </Modal>
    </>
  )
}
