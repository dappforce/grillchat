import MediaLoader from '@/components/MediaLoader'
import { getNftQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { NftExtension } from '@subsocial/api/types'
import { RepliedMessagePreviewPartProps } from '../types'

const NftRepliedMessagePreviewPart = ({
  extensions,
  className,
}: RepliedMessagePreviewPartProps) => {
  const firstExtension = extensions?.[0] as NftExtension
  const hasNftExtension =
    firstExtension && firstExtension.id === 'subsocial-evm-nft'

  const { data: nftData } = getNftQuery.useQuery(
    firstExtension?.properties ?? null
  )

  return (
    <span className={cx('block w-10', className)}>
      {hasNftExtension && (
        <MediaLoader
          containerClassName={cx('rounded-md overflow-hidden flex-shrink-0')}
          className={cx('aspect-square w-full')}
          placeholderClassName={cx('w-full aspect-square')}
          width={50}
          height={50}
          src={nftData?.image}
        />
      )}
    </span>
  )
}

export default NftRepliedMessagePreviewPart
