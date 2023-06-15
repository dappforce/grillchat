import ImageLoader from '@/components/ImageLoader'
import { getNftQuery } from '@/services/api/query'
import { cx } from '@/utils/class-names'
import { NftExtension } from '@subsocial/api/types'
import { RepliedMessagePreviewPartProps } from '../RepliedMessagePreviewParts'

const NftRepliedMessagePreviewPart = ({
  extensions,
}: RepliedMessagePreviewPartProps) => {
  const firstExtension = extensions?.[0] as NftExtension
  const hasNftExtension =
    firstExtension && firstExtension.id === 'subsocial-evm-nft'

  const { data: nftData } = getNftQuery.useQuery(
    firstExtension?.properties ?? null
  )

  return (
    <span>
      {hasNftExtension && (
        <ImageLoader
          containerClassName={cx('rounded-md overflow-hidden flex-shrink-0')}
          className={cx('aspect-square w-10')}
          placeholderClassName={cx('w-10 aspect-square')}
          image={nftData?.image}
        />
      )}
    </span>
  )
}

export default NftRepliedMessagePreviewPart
