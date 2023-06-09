import Button from '@/components/Button'
import ClickableImage from '@/components/ClickableImage'
import ImageLoader from '@/components/ImageLoader'
import LinkText from '@/components/LinkText'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import { getNftDataQuery, getNftPriceQuery } from '@/services/external/query'
import { cx } from '@/utils/class-names'
import truncate from 'lodash.truncate'
import CommonChatItem, { ExtensionChatItemProps } from '../CommonChatItem'

type Props = ExtensionChatItemProps

export default function NftChatItem(props: Props) {
  const { message } = props
  const { content } = message
  const { extensions } = content || {}

  const nftProperties = extensions?.[0]?.properties
  const { data: nftData, isLoading: isLoadingNftData } =
    getNftDataQuery.useQuery(nftProperties ?? null)
  const { data: nftPrice, isLoading: isLoadingNftPrice } =
    getNftPriceQuery.useQuery(nftProperties ?? null)

  const { IntegratedSkeleton: NftDataSkeleton } =
    useIntegratedSkeleton(isLoadingNftData)
  const { IntegratedSkeleton: NftPriceSkeleton } =
    useIntegratedSkeleton(isLoadingNftPrice)

  return (
    <CommonChatItem
      {...props}
      myMessageConfig={{ children: 'bottom', checkMark: 'outside' }}
      className='max-w-xs'
    >
      {({ isMyMessage }) => (
        <div className='flex flex-col [&:not(:first-child)]:mt-1'>
          <div
            className={cx('relative flex w-full items-center justify-center')}
          >
            <ClickableImage
              src={nftData?.image ?? ''}
              alt=''
              trigger={(onClick) => (
                <ImageLoader
                  containerClassName='rounded-[4px] overflow-hidden w-full cursor-pointer'
                  placeholderClassName={cx('w-[320px] aspect-square')}
                  className='w-[320px] object-contain'
                  image={nftData?.image ?? ''}
                  onClick={onClick}
                />
              )}
            />
            <span className='absolute right-2 top-2 rounded-full bg-text-dark/50 px-2 py-0.5 text-xs text-neutral-300'>
              NFT
            </span>
          </div>
          <div className='mt-1.5 flex flex-col gap-1 px-2.5'>
            <div className='flex items-center justify-between gap-2'>
              <LinkText href={nftProperties?.url ?? ''} openInNewTab>
                <NftDataSkeleton content={nftData}>
                  {(data) => data?.name ?? data?.collectionName}
                </NftDataSkeleton>
              </LinkText>
              <span className='text-xs'>
                #
                {truncate(nftProperties?.nftId, {
                  length: 8,
                })}
              </span>
            </div>
            <div
              className={cx(
                'flex items-center justify-between text-xs',
                isMyMessage ? 'text-text-muted-on-primary' : 'text-text-muted'
              )}
            >
              <NftDataSkeleton content={nftData} className={cx('w-16')}>
                {(data) => <span>{data?.collectionName}</span>}
              </NftDataSkeleton>
              <NftPriceSkeleton content={nftPrice} className={cx('w-16')}>
                {(data) => <span>{data}</span>}
              </NftPriceSkeleton>
            </div>
            <Button
              className='my-2 mb-3'
              variant={isMyMessage ? 'whiteOutline' : 'primaryOutline'}
              href={nftProperties?.url ?? ''}
              target='_blank'
              rel='noopener noreferrer'
            >
              View on Marketplace
            </Button>
          </div>
        </div>
      )}
    </CommonChatItem>
  )
}
