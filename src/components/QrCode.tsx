import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import QRCode from 'react-qr-code'

export interface QrCodeProps extends ComponentProps<'div'> {
  url: string
}

export default function QrCode({ url, ...props }: QrCodeProps) {
  return (
    <div
      {...props}
      className={cx(
        'mx-auto mb-2 h-40 w-40 rounded-2xl bg-white p-4',
        props.className
      )}
    >
      <QRCode
        value={url}
        size={256}
        className='h-full w-full'
        viewBox='0 0 256 256'
      />
    </div>
  )
}
