import QrCode from '../QrCode'
import Modal, { ModalProps } from './Modal'

export type QrCodeModalProps = Omit<ModalProps, 'children'> & {
  url: string
  urlTitle?: string
}

export default function QrCodeModal({
  url,
  urlTitle,
  ...props
}: QrCodeModalProps) {
  return (
    <Modal {...props} withCloseButton={!props.onBackClick}>
      <div className='mb-4 mt-6 flex flex-col'>
        <QrCode url={url} />
        {urlTitle && <p className='mt-3 text-center text-2xl'>{urlTitle}</p>}
      </div>
    </Modal>
  )
}
