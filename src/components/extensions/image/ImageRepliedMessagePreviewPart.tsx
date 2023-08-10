import MediaLoader from '@/components/MediaLoader'
import { cx } from '@/utils/class-names'
import { RepliedMessagePreviewPartProps } from '../types'
import { getMessageExtensionProperties } from '../utils'

export default function ImageRepliedMessagePreviewPart({
  extensions,
  className,
}: RepliedMessagePreviewPartProps) {
  const firstExtension = extensions?.[0]
  const properties = getMessageExtensionProperties(
    firstExtension,
    'subsocial-image'
  )

  return (
    <span className={cx('block w-10 flex-shrink-0', className)}>
      <MediaLoader
        containerClassName={cx('rounded-md overflow-hidden flex-shrink-0')}
        className={cx('aspect-square w-full rounded-md object-cover')}
        placeholderClassName={cx('w-full aspect-square')}
        width={50}
        height={50}
        src={properties?.image}
      />
    </span>
  )
}
